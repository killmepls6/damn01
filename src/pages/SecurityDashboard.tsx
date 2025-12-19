import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Users, Activity } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export default function SecurityDashboard() {
  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/admin/activity-logs"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Parse log details safely
  const parseDetails = (details: string) => {
    try {
      return JSON.parse(details);
    } catch {
      return {};
    }
  };

  // Get severity badge
  const getSeverityBadge = (details: any) => {
    const severity = details?.severity || "low";
    const colors = {
      low: "bg-blue-500/10 text-blue-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      high: "bg-orange-500/10 text-orange-500",
      critical: "bg-red-500/10 text-red-500",
    };
    return <Badge className={colors[severity as keyof typeof colors]}>{severity}</Badge>;
  };

  // Get action badge
  const getActionBadge = (action: string) => {
    if (action.includes("failed") || action.includes("unauthorized")) {
      return <Badge variant="destructive">{action}</Badge>;
    }
    if (action.includes("success") || action.includes("created")) {
      return <Badge variant="default" className="bg-green-500/10 text-green-500">{action}</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  // Statistics
  const stats = {
    total: logs.length,
    loginAttempts: logs.filter(l => l.action.includes("login")).length,
    failures: logs.filter(l => l.action.includes("failed") || l.action.includes("unauthorized")).length,
    suspicious: logs.filter(l => {
      const details = parseDetails(l.details);
      return details.severity === "high" || details.severity === "critical";
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-muted-foreground">Real-time security monitoring and audit logs</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Login Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loginAttempts}</div>
              <p className="text-xs text-muted-foreground">All authentication</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Failures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.failures}</div>
              <p className="text-xs text-muted-foreground">Failed/Unauthorized</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Suspicious
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.suspicious}</div>
              <p className="text-xs text-muted-foreground">High/Critical severity</p>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Real-time security events and administrative actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading security logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No security events recorded</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 50).map((log) => {
                      const details = parseDetails(log.details);
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {format(new Date(log.createdAt), "MMM dd, HH:mm:ss")}
                          </TableCell>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell>{getSeverityBadge(details)}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.targetType}
                            {log.targetId && `:${log.targetId.slice(0, 8)}`}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                            {details.reason || details.description || details.username || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
