import { useState, useEffect } from "react";
import { Activity, Users, Clock, Server, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState({
    online: true,
    playerCount: 42,
    maxPlayers: 64,
    uptime: "2 dagen, 14 uur",
    ping: 23,
    lastUpdate: new Date().toLocaleTimeString("nl-NL")
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServerStatus(prev => ({
        ...prev,
        playerCount: Math.floor(Math.random() * 64),
        ping: Math.floor(Math.random() * 50) + 15,
        lastUpdate: new Date().toLocaleTimeString("nl-NL")
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Server Status</h1>
          <p className="text-lg text-muted-foreground">
            Real-time informatie over onze Civitas RP server
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Server Online Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={serverStatus.online 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    serverStatus.online ? "bg-green-500" : "bg-red-500"
                  }`} />
                  {serverStatus.online ? "Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Laatste update: {serverStatus.lastUpdate}
              </p>
            </CardContent>
          </Card>

          {/* Player Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spelers Online</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serverStatus.playerCount}/{serverStatus.maxPlayers}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((serverStatus.playerCount / serverStatus.maxPlayers) * 100)}% vol
              </p>
            </CardContent>
          </Card>

          {/* Server Ping */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ping</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serverStatus.ping}ms</div>
              <p className="text-xs text-muted-foreground">
                {serverStatus.ping < 50 ? "Uitstekend" : 
                 serverStatus.ping < 100 ? "Goed" : "Matig"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Server Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Server Informatie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server Naam:</span>
                <span className="font-medium">Civitas RP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server IP:</span>
                <span className="font-medium font-mono">cfx.re/join/9z4q83</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-medium">{serverStatus.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versie:</span>
                <span className="font-medium">FiveM 2024.1</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Server Tijden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server Tijd:</span>
                <span className="font-medium">{new Date().toLocaleTimeString("nl-NL")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restart Schema:</span>
                <span className="font-medium">Dagelijks om 06:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volgende Restart:</span>
                <span className="font-medium">
                  {(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(6, 0, 0, 0);
                    return tomorrow.toLocaleString("nl-NL");
                  })()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Connect */}
        <Card>
          <CardHeader>
            <CardTitle>Hoe verbind je met de server?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Via FiveM Client:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Open FiveM</li>
                  <li>Ga naar "Direct Connect"</li>
                  <li>Voer in: <code className="bg-muted px-2 py-1 rounded">cfx.re/join/9z4q83</code></li>
                  <li>Klik op "Connect"</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Via F8 Console:</h4>
                <p className="text-sm text-muted-foreground">
                  Druk F8 in FiveM en typ: <code className="bg-muted px-2 py-1 rounded">connect cfx.re/join/9z4q83</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServerStatus;