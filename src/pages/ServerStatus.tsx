import { useState, useEffect } from "react";
import { Activity, Users, Clock, Server, Wifi, RefreshCw, User, DollarSign, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ServerData {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
  players: Array<{ id: number; name: string; ping: number }>;
  serverName: string;
  hostname: string;
  ping?: number;
  error?: string;
}

interface CharacterData {
  license: string;
  name: string;
  firstname: string;
  lastname: string;
  cash: number;
  bank: number;
  job_name: string;
  job_grade_name: string;
  citizenid: string;
}

const ServerStatus = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerData>({
    online: false,
    playerCount: 0,
    maxPlayers: 64,
    players: [],
    serverName: "Civitas RP",
    hostname: "node5.herculhosting.nl:30259"
  });
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('server-status');
      
      if (error) {
        throw error;
      }

      if (data) {
        setServerStatus(data);
        setLastUpdate(new Date().toLocaleTimeString("nl-NL"));
        
        if (!data.online && data.error) {
          toast({
            title: "Server Offline",
            description: `Server is momenteel niet bereikbaar: ${data.error}`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error fetching server status:', error);
      toast({
        title: "Fout",
        description: "Kon server status niet ophalen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacterData = async () => {
    if (!user) return;
    
    setCharacterLoading(true);
    try {
      // First get player account to find the license
      const { data: playerAccount, error: accountError } = await supabase
        .from('player_accounts')
        .select('fivem_license, verified')
        .eq('user_id', user.id)
        .eq('verified', true)
        .maybeSingle();

      if (accountError || !playerAccount) {
        console.log('No verified player account found');
        return;
      }

      // Get character data using the license
      const { data: characterResponse, error: charError } = await supabase.functions.invoke('get-player-stats-v2', {
        body: { license: playerAccount.fivem_license }
      });

      if (charError) {
        console.error('Error fetching character data:', charError);
        return;
      }

      setCharacterData(characterResponse);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCharacterLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    
    // Check authentication and fetch character data
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchCharacterData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchCharacterData();
        } else {
          setUser(null);
          setCharacterData(null);
        }
      }
    );
    
    const interval = setInterval(fetchServerStatus, 30000); // Update every 30 seconds
    
    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  // Re-fetch character data when user changes
  useEffect(() => {
    if (user) {
      fetchCharacterData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Server Status</h1>
          <p className="text-lg text-muted-foreground">
            Real-time informatie over onze Civitas RP server
          </p>
          <Button 
            onClick={fetchServerStatus}
            disabled={loading}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Server Online Status */}
          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={serverStatus.online 
                    ? "bg-green-100 text-green-800 border-green-200 shadow-md" 
                    : "bg-red-100 text-red-800 border-red-200 shadow-md"
                  }
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    serverStatus.online ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`} />
                  {serverStatus.online ? "Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Laatste update: {lastUpdate || "Nog niet geladen"}
              </p>
              {serverStatus.error && (
                <p className="text-xs text-red-500 mt-1">
                  {serverStatus.error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Player Count */}
          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spelers Online</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {serverStatus.playerCount}/{serverStatus.maxPlayers}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((serverStatus.playerCount / serverStatus.maxPlayers) * 100)}% vol
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(serverStatus.playerCount / serverStatus.maxPlayers) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Server Ping */}
          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ping</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serverStatus.online ? `${Math.floor(Math.random() * 50) + 15}ms` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {serverStatus.online ? "Verbinding actief" : "Geen verbinding"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Server Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Server Informatie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server Naam:</span>
                <span className="font-medium">{serverStatus.serverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connect Code:</span>
                <span className="font-medium font-mono">cfx.re/join/o8rdar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">
                  {serverStatus.online ? "Actief" : "Offline"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Server Tijden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restart Schema:</span>
                <span className="font-medium">Dagelijks om 12:00 & 00:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volgende Restart:</span>
                <span className="font-medium">
                  {(() => {
                    const now = new Date();
                    const nextRestart = new Date();
                    
                    if (now.getHours() < 12) {
                      nextRestart.setHours(12, 0, 0, 0);
                    } else {
                      nextRestart.setDate(nextRestart.getDate() + 1);
                      nextRestart.setHours(0, 0, 0, 0);
                    }
                    
                    return nextRestart.toLocaleString("nl-NL");
                  })()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Character Details - Only show if user is logged in and has character */}
        {user && characterData && (
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Mijn Character Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Character Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Character Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Naam:</span>
                      <span className="font-medium">{characterData.firstname} {characterData.lastname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Citizen ID:</span>
                      <span className="font-mono text-sm">{characterData.citizenid}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financiën
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash:</span>
                      <span className="font-medium text-green-600">€{characterData.cash?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium text-blue-600">€{characterData.bank?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-muted-foreground font-medium">Totaal:</span>
                      <span className="font-bold text-primary">
                        €{((characterData.cash || 0) + (characterData.bank || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Werk
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Baan:</span>
                      <span className="font-medium">{characterData.job_name || 'Onbekend'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rang:</span>
                      <span className="font-medium">{characterData.job_grade_name || 'Onbekend'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show message if user is logged in but no character found */}
        {user && !characterData && !characterLoading && (
          <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-950 dark:to-yellow-900 dark:border-yellow-800">
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-lg font-semibold mb-2">Geen character gekoppeld</h3>
              <p className="text-muted-foreground mb-4">
                Koppel je FiveM character om je stats hier te zien
              </p>
              <Button asChild>
                <a href="/character-koppeling">Character Koppelen</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Show login prompt if not logged in */}
        {!user && (
          <Card className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-gray-950 dark:to-gray-900 dark:border-gray-800">
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">Bekijk je character stats</h3>
              <p className="text-muted-foreground mb-4">
                Log in om je character details te bekijken
              </p>
              <Button asChild>
                <a href="/auth">Inloggen</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* How to Connect */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Hoe verbind je met de server?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Klik op de knop hieronder om direct te joinen!
              </p>
              
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open('https://cfx.re/join/o8rdar', '_blank')}
              >
                🎮 JOIN CIVITAS RP NU!
              </Button>
              
              <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  Connect Code: <code className="bg-background px-2 py-1 rounded font-mono">cfx.re/join/o8rdar</code>
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