import { WebSocket, WebSocketServer } from 'ws';
import { type Server } from 'http';
import { nanoid } from 'nanoid';
import cookie from 'cookie';
import signature from 'cookie-signature';
import Database from 'better-sqlite3';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

interface WebSocketClient {
  id: string;
  ws: WebSocket;
  userId?: string;
  isAdmin: boolean;
  isAlive: boolean;
  lastPing: number;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 30000; // 30 seconds
  private readonly PING_TIMEOUT = 5000; // 5 seconds

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    console.log('[websocket] WebSocket server initialized on /ws');

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = nanoid();
      
      // SECURITY FIX: Validate session from HTTP cookie
      const { userId, isAdmin } = this.validateSession(req);
      
      const client: WebSocketClient = {
        id: clientId,
        ws,
        userId,
        isAdmin,
        isAlive: true,
        lastPing: Date.now()
      };

      this.clients.set(clientId, client);
      console.log(`[websocket] Client connected: ${clientId} (userId: ${userId || 'anonymous'}, admin: ${isAdmin}, total: ${this.clients.size})`);

      // Send welcome message with authenticated user info
      this.sendToClient(clientId, {
        type: 'connection',
        payload: { 
          clientId, 
          message: 'Connected to MangaVerse WebSocket',
          authenticated: !!userId,
          isAdmin
        },
        timestamp: Date.now()
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error(`[websocket] Error parsing message from ${clientId}:`, error);
        }
      });

      // Handle pong responses
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
          client.lastPing = Date.now();
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`[websocket] Client disconnected: ${clientId} (total: ${this.clients.size})`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`[websocket] Client ${clientId} error:`, error);
        this.clients.delete(clientId);
      });
    });

    // Start heartbeat mechanism
    this.startHeartbeat();
  }

  private startHeartbeat() {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      
      this.clients.forEach((client, clientId) => {
        // Check if client responded to last ping
        if (!client.isAlive) {
          console.log(`[websocket] Terminating inactive client: ${clientId}`);
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        // Mark as not alive and send ping
        client.isAlive = false;
        client.ws.ping();
      });
    }, this.PING_INTERVAL);
  }

  private handleMessage(clientId: string, message: any) {
    // Handle client messages (subscriptions, etc.)
    // Note: Authentication is now handled server-side during WebSocket upgrade
    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(clientId, message.payload);
        break;
      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          payload: {},
          timestamp: Date.now()
        });
        break;
      default:
        console.log(`[websocket] Unknown message type from ${clientId}:`, message.type);
    }
  }

  /**
   * SECURITY: Validate session from HTTP cookie during WebSocket upgrade
   * This prevents clients from spoofing userId by validating against the session database
   */
  private validateSession(req: any): { userId: string | undefined, isAdmin: boolean } {
    try {
      // Parse cookies from request
      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
      const signedSessionCookie = cookies['auth.sid'];
      
      if (!signedSessionCookie) {
        console.log('[websocket] No session cookie found');
        return { userId: undefined, isAdmin: false };
      }

      // Unsign the cookie - express-session uses format "s:SID.signature"
      // cookie-signature.unsign expects the full value including "s:" prefix
      const sessionSecret = process.env.SESSION_SECRET || 'replit-auth-secret-offline-first-manga-platform';
      
      const unsignedSessionId = signature.unsign(signedSessionCookie, sessionSecret);
      
      if (unsignedSessionId === false) {
        console.log('[websocket] Invalid session signature');
        return { userId: undefined, isAdmin: false };
      }

      // Open session database
      const sessionsDb = new Database('./data/sessions.db', { readonly: true });
      
      // Query session with unsigned session ID
      const session = sessionsDb.prepare('SELECT sess FROM sessions WHERE sid = ?').get(unsignedSessionId) as any;
      sessionsDb.close();
      
      if (!session || !session.sess) {
        console.log('[websocket] Session not found in database');
        return { userId: undefined, isAdmin: false };
      }

      // Parse session data
      const sessionData = JSON.parse(session.sess);
      const userId = sessionData.userId;
      const isAdmin = sessionData.user?.isAdmin === 'true' || 
                      sessionData.user?.role === 'admin' ||
                      sessionData.user?.role === 'owner';
      
      if (userId) {
        console.log(`[websocket] Validated session for user ${userId} (admin: ${isAdmin})`);
        return { userId, isAdmin };
      }
      
      return { userId: undefined, isAdmin: false };
    } catch (error) {
      console.error('[websocket] Error validating session:', error);
      return { userId: undefined, isAdmin: false };
    }
  }

  private handleSubscribe(clientId: string, payload: { channels: string[] }) {
    // Future: Implement channel-based subscriptions for targeted updates
    console.log(`[websocket] Client ${clientId} subscribed to channels:`, payload.channels);
  }

  // Send message to specific client
  private sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // Broadcast to all connected clients
  broadcast(message: WebSocketMessage) {
    const payload = JSON.stringify(message);
    let sent = 0;

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
        sent++;
      }
    });

    console.log(`[websocket] Broadcast '${message.type}' to ${sent} clients`);
  }

  // Broadcast to specific users
  broadcastToUsers(userIds: string[], message: WebSocketMessage) {
    const payload = JSON.stringify(message);
    let sent = 0;

    this.clients.forEach((client) => {
      if (client.userId && userIds.includes(client.userId) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
        sent++;
      }
    });

    console.log(`[websocket] Broadcast '${message.type}' to ${sent} users`);
  }

  // Broadcast to authenticated users only
  broadcastToAuthenticated(message: WebSocketMessage) {
    const payload = JSON.stringify(message);
    let sent = 0;

    this.clients.forEach((client) => {
      if (client.userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
        sent++;
      }
    });

    console.log(`[websocket] Broadcast '${message.type}' to ${sent} authenticated users`);
  }

  // Get connection statistics
  getStats() {
    const total = this.clients.size;
    const authenticated = Array.from(this.clients.values()).filter(c => c.userId).length;
    const alive = Array.from(this.clients.values()).filter(c => c.isAlive).length;

    return {
      total,
      authenticated,
      alive,
      inactive: total - alive
    };
  }

  // Cleanup
  shutdown() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.clients.forEach((client) => {
      client.ws.close();
    });

    this.clients.clear();
    
    if (this.wss) {
      this.wss.close();
    }

    console.log('[websocket] WebSocket server shut down');
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();
