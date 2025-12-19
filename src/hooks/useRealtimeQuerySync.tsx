import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';

/**
 * Hook that syncs WebSocket events with React Query cache invalidation
 * 
 * This hook establishes a WebSocket connection and automatically invalidates
 * React Query caches when admin actions occur, enabling instant UI updates
 * without page refresh or polling.
 * 
 * Event types handled:
 * - ad: Ad created/updated/deleted
 * - series: Series created/updated/deleted
 * - chapter: Chapter uploaded/deleted
 * - settings: Settings updated
 * - user: User banned/unbanned/role changed
 * - system: System-wide notifications
 */
export function useRealtimeQuerySync() {
  const queryClient = useQueryClient();
  
  // Determine WebSocket URL based on environment
  const getWebSocketUrl = () => {
    if (typeof window === 'undefined') return '';
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  };
  
  const { isConnected, subscribe } = useWebSocket(getWebSocketUrl(), {
    reconnect: true,
    reconnectInterval: 1000,
    heartbeatInterval: 30000,
    onConnect: () => {
      console.log('[RealtimeSync] Connected to WebSocket - real-time updates enabled');
    },
    onDisconnect: () => {
      console.log('[RealtimeSync] Disconnected from WebSocket');
    },
    onError: (error) => {
      console.error('[RealtimeSync] WebSocket error:', error);
    }
  });
  
  useEffect(() => {
    if (!isConnected) return;
    
    console.log('[RealtimeSync] Setting up query invalidation listeners...');
    
    // Ad events - invalidate ad queries
    const unsubscribeAd = subscribe('ad', (payload) => {
      console.log('[RealtimeSync] Ad event received:', payload);
      
      // Invalidate all ad-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ads'] });
      
      // Invalidate specific ad if adId provided
      if (payload.adId) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/ads', payload.adId] });
        
        // If ad was deleted, remove it from cache
        if (payload.action === 'deleted') {
          queryClient.removeQueries({ queryKey: ['/api/admin/ads', payload.adId] });
        }
      }
      
      // Invalidate placement-based queries
      if (payload.data?.placement) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/ads/placement', payload.data.placement] 
        });
      }
    });
    
    // Series events - invalidate series queries
    const unsubscribeSeries = subscribe('series', (payload) => {
      console.log('[RealtimeSync] Series event received:', payload);
      
      // Invalidate all series lists
      queryClient.invalidateQueries({ queryKey: ['/api/series'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/series'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trending'] });
      
      // Invalidate specific series if seriesId provided
      if (payload.seriesId) {
        queryClient.invalidateQueries({ queryKey: ['/api/series', payload.seriesId] });
        
        // If series was deleted, remove it from cache
        if (payload.action === 'deleted') {
          queryClient.removeQueries({ queryKey: ['/api/series', payload.seriesId] });
        }
      }
    });
    
    // Chapter events - invalidate chapter queries
    const unsubscribeChapter = subscribe('chapter', (payload) => {
      console.log('[RealtimeSync] Chapter event received:', payload);
      
      // Invalidate chapter lists for affected series
      if (payload.seriesId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/series', payload.seriesId, 'chapters'] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['/api/admin/chapters', payload.seriesId] 
        });
      }
      
      // Invalidate specific chapter if chapterId provided
      if (payload.chapterId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/chapters', payload.chapterId] 
        });
        
        // If chapter was deleted, remove it from cache
        if (payload.action === 'deleted') {
          queryClient.removeQueries({ 
            queryKey: ['/api/chapters', payload.chapterId] 
          });
        }
      }
    });
    
    // Settings events - invalidate settings queries
    const unsubscribeSettings = subscribe('settings', (payload) => {
      console.log('[RealtimeSync] Settings event received:', payload);
      
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      
      // Invalidate specific category if provided
      if (payload.category) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/settings', payload.category] 
        });
      }
    });
    
    // Ad intensity events - invalidate ad settings
    const unsubscribeAdIntensity = subscribe('adIntensity', (payload) => {
      console.log('[RealtimeSync] Ad intensity event received:', payload);
      
      // Invalidate ad settings and ad queries
      queryClient.invalidateQueries({ queryKey: ['/api/settings', 'ads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ads'] });
    });
    
    // User events - invalidate user queries
    const unsubscribeUser = subscribe('user', (payload) => {
      console.log('[RealtimeSync] User event received:', payload);
      
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      
      // Invalidate specific user if userId provided
      if (payload.userId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', payload.userId] });
        
        // If current user was affected, invalidate current user query
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }
    });
    
    // Subscription package events
    const unsubscribeSubscription = subscribe('subscription', (payload) => {
      console.log('[RealtimeSync] Subscription event received:', payload);
      
      // Invalidate subscription lists
      queryClient.invalidateQueries({ queryKey: ['/api/subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop'] });
      
      // Invalidate specific package if provided
      if (payload.packageId) {
        queryClient.invalidateQueries({ queryKey: ['/api/subscriptions', payload.packageId] });
      }
    });
    
    // Battle Pass events
    const unsubscribeBattlePass = subscribe('battlepass', (payload) => {
      console.log('[RealtimeSync] Battle Pass event received:', payload);
      
      // Invalidate battle pass queries
      queryClient.invalidateQueries({ queryKey: ['/api/battle-pass'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/battle-pass'] });
      
      if (payload.seasonId) {
        queryClient.invalidateQueries({ queryKey: ['/api/battle-pass/seasons', payload.seasonId] });
      }
    });
    
    // Flash Sale events
    const unsubscribeFlashSale = subscribe('flashsale', (payload) => {
      console.log('[RealtimeSync] Flash Sale event received:', payload);
      
      // Invalidate flash sale queries
      queryClient.invalidateQueries({ queryKey: ['/api/flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/flash-sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop'] });
    });
    
    // Coupon events
    const unsubscribeCoupon = subscribe('coupon', (payload) => {
      console.log('[RealtimeSync] Coupon event received:', payload);
      
      // Invalidate coupon queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/coupons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coupons'] });
    });
    
    // Package/Bundle events
    const unsubscribePackage = subscribe('package', (payload) => {
      console.log('[RealtimeSync] Package event received:', payload);
      
      // Invalidate package queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bundles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop'] });
    });
    
    // Role events
    const unsubscribeRole = subscribe('role', (payload) => {
      console.log('[RealtimeSync] Role event received:', payload);
      
      // Invalidate role queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/roles'] });
      
      // If role permissions changed, refresh user data
      if (payload.action === 'permissions_updated') {
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }
    });
    
    // Currency events
    const unsubscribeCurrency = subscribe('currency', (payload) => {
      console.log('[RealtimeSync] Currency event received:', payload);
      
      // Invalidate currency queries
      queryClient.invalidateQueries({ queryKey: ['/api/currency'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currency'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
    });
    
    // System events - show notifications
    const unsubscribeSystem = subscribe('system', (payload) => {
      console.log('[RealtimeSync] System event received:', payload);
      
      // For system-wide events, invalidate common queries
      if (payload.type === 'maintenance') {
        queryClient.invalidateQueries();
      }
      
      // Could dispatch custom events for UI notifications here
      window.dispatchEvent(new CustomEvent('system-notification', {
        detail: payload
      }));
    });
    
    console.log('[RealtimeSync] ✅ All query invalidation listeners active');
    
    // Cleanup subscriptions
    return () => {
      console.log('[RealtimeSync] Cleaning up subscriptions...');
      unsubscribeAd();
      unsubscribeSeries();
      unsubscribeChapter();
      unsubscribeSettings();
      unsubscribeAdIntensity();
      unsubscribeUser();
      unsubscribeSubscription();
      unsubscribeBattlePass();
      unsubscribeFlashSale();
      unsubscribeCoupon();
      unsubscribePackage();
      unsubscribeRole();
      unsubscribeCurrency();
      unsubscribeSystem();
    };
  }, [isConnected, subscribe, queryClient]);
  
  return {
    isConnected,
    isSyncEnabled: isConnected
  };
}
