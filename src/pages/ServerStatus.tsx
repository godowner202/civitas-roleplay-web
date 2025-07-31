import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Users, 
  Zap, 
  Clock, 
  Activity,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const ServerStatus = () => {
  // Mock data - in een echte implementatie zou dit van een API komen
  const serverData = {
    status: "online",
    uptime: "7 dagen, 14 uur",
    playerCount: 0, // Verwijderd zoals gevraagd
    maxPlayers: 64,
    performance: {
      cpu: 45,
      memory: 67,
      network: 23
    },
    lastUpdate: new Date().toLocaleTimeString('nl-NL')
  };

  const services = [
    { name: "FiveM Server", status: "online", responseTime: "12ms" },
    { name: "Discord Bot", status: "online", responseTime: "8ms" },
    { name: "Website", status: "online", responseTime: "156ms" },
    { name: "Database", status: "online", responseTime: "5ms" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "offline":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "maintenance":
        return <AlertCircle className="w-4 h-4" />;
      case "offline":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Server Status
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bekijk de real-time status van onze Civitas RP servers en diensten.
          </p>
        </div>

        {/* Main Server Status */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Server className="w-6 h-6 text-primary" />
                  Civitas RP Server
                </CardTitle>
                <Badge className={getStatusColor(serverData.status)}>
                  {getStatusIcon(serverData.status)}
                  {serverData.status === "online" ? "Online" : serverData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="font-semibold">{serverData.uptime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Capaciteit</p>
                      <p className="font-semibold">{serverData.maxPlayers} slots beschikbaar</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Laatste update</p>
                      <p className="font-semibold">{serverData.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">Alle systemen operationeel</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">CPU Gebruik</span>
                  <span className="font-semibold">{serverData.performance.cpu}%</span>
                </div>
                <Progress value={serverData.performance.cpu} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Memory Gebruik</span>
                  <span className="font-semibold">{serverData.performance.memory}%</span>
                </div>
                <Progress value={serverData.performance.memory} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Network Load</span>
                  <span className="font-semibold">{serverData.performance.network}%</span>
                </div>
                <Progress value={serverData.performance.network} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Status */}
        <Card>
          <CardHeader>
            <CardTitle>Diensten Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{service.name}</h3>
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Response tijd: {service.responseTime}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Server Informatie</h2>
            <p className="text-muted-foreground mb-6">
              Onze servers worden 24/7 gemonitord om de beste ervaring te garanderen. 
              Bij onderhoud of updates informeren we je via Discord.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Server Locatie</p>
                <p className="font-semibold">Nederland, Amsterdam</p>
              </div>
              <div>
                <p className="text-muted-foreground">Server Versie</p>
                <p className="font-semibold">FiveM Latest</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServerStatus;