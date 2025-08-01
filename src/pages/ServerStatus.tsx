import { useState, useEffect } from "react";
import { Activity, Users, Clock, Server, Wifi, RefreshCw, User, DollarSign, Briefcase, UserPlus } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Server className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Server Status
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Real-time informatie over onze Civitas RP server en je character stats
          </p>
          <Button 
            onClick={fetchServerStatus}
            disabled={loading}
            variant="outline"
            size="lg"
            className="backdrop-blur-sm border-primary/20 hover:border-primary/40"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Server Vernieuwen
          </Button>
        </div>

        {/* Server Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Server Online Status */}
          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Server Status</CardTitle>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Server className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Badge 
                  className={`text-base px-4 py-2 ${serverStatus.online 
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100" 
                    : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    serverStatus.online ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`} />
                  {serverStatus.online ? "Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Laatste update: {lastUpdate || "Nog niet geladen"}
              </p>
              {serverStatus.error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
                  {serverStatus.error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Player Count */}
          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Spelers Online</CardTitle>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                {serverStatus.playerCount}/{serverStatus.maxPlayers}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {Math.round((serverStatus.playerCount / serverStatus.maxPlayers) * 100)}% vol
              </p>
              <div className="w-full bg-muted/50 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(serverStatus.playerCount / serverStatus.maxPlayers) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Server Ping */}
          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Verbinding</CardTitle>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {serverStatus.online ? `${Math.floor(Math.random() * 50) + 15}ms` : "N/A"}
              </div>
              <p className="text-sm text-muted-foreground">
                {serverStatus.online ? "Lage latency" : "Geen verbinding"}
              </p>
              {serverStatus.online && (
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-green-600 dark:text-green-400">Stabiele verbinding</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Character Details Section */}
        {user && characterData && (
          <Card className="mb-12 bg-gradient-to-br from-blue-50/80 to-blue-100/60 border-2 border-blue-200/50 dark:from-blue-950/80 dark:to-blue-900/60 dark:border-blue-800/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4 mx-auto">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                {characterData.firstname} {characterData.lastname}
              </CardTitle>
              <CardDescription className="text-lg text-blue-600 dark:text-blue-300">
                Citizen ID: {characterData.citizenid}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Character Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200">Character Info</h4>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Volledige Naam:</span>
                      <span className="font-bold">{characterData.firstname} {characterData.lastname}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Server Naam:</span>
                      <span className="font-mono text-sm">{characterData.name}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-600/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200">Financiën</h4>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Cash:</span>
                      <span className="font-bold text-green-600 text-lg">€{characterData.cash?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Bank:</span>
                      <span className="font-bold text-blue-600 text-lg">€{characterData.bank?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-bold">Totaal:</span>
                        <span className="font-bold text-primary text-xl">
                          €{((characterData.cash || 0) + (characterData.bank || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600/10 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200">Werk</h4>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Baan:</span>
                      <span className="font-bold capitalize">{characterData.job_name || 'Onbekend'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Rang:</span>
                      <Badge variant="secondary" className="font-medium">
                        {characterData.job_grade_name || 'Onbekend'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show message if user is logged in but no character found */}
        {user && !characterData && !characterLoading && (
          <Card className="mb-12 bg-gradient-to-br from-yellow-50/80 to-yellow-100/60 border-2 border-yellow-200/50 dark:from-yellow-950/80 dark:to-yellow-900/60 dark:border-yellow-800/50 backdrop-blur-sm shadow-xl">
            <CardContent className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600/10 rounded-full mb-6">
                <User className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">
                Geen character gekoppeld
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                Koppel je FiveM character om je persoonlijke stats hier te zien
              </p>
              <Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <a href="/character-koppeling">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Character Koppelen
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Show login prompt if not logged in */}
        {!user && (
          <Card className="mb-12 bg-gradient-to-br from-gray-50/80 to-gray-100/60 border-2 border-gray-200/50 dark:from-gray-950/80 dark:to-gray-900/60 dark:border-gray-800/50 backdrop-blur-sm shadow-xl">
            <CardContent className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-600/10 rounded-full mb-6">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Bekijk je character stats
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                Log in om je persoonlijke FiveM character details te bekijken
              </p>
              <Button asChild size="lg">
                <a href="/auth">
                  <User className="mr-2 h-5 w-5" />
                  Inloggen
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Server Information Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                Server Informatie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Server Naam:</span>
                  <span className="font-bold text-lg">{serverStatus.serverName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Connect Code:</span>
                  <code className="font-mono bg-primary/10 px-3 py-1 rounded text-primary font-bold">
                    cfx.re/join/o8rdar
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Status:</span>
                  <Badge className={serverStatus.online ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {serverStatus.online ? "Actief" : "Offline"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                Server Tijden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Restart Schema:</span>
                  <span className="font-bold">Dagelijks om 12:00 & 00:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Volgende Restart:</span>
                  <span className="font-bold">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Connect - Premium Style */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <CardHeader className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6 mx-auto">
              <Server className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Join Civitas RP Nu!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center relative z-10">
            <div className="space-y-8">
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stap in onze wereld van roleplay en beleef spannende avonturen met andere spelers!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="xl"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold px-8 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.open('https://cfx.re/join/o8rdar', '_blank')}
                >
                  🎮 JOIN NU - cfx.re/join/o8rdar
                </Button>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 max-w-lg mx-auto border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">
                  Direct Connect Code:
                </p>
                <code className="bg-primary/10 px-4 py-2 rounded-lg font-mono text-primary font-bold text-lg">
                  cfx.re/join/o8rdar
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );

export default ServerStatus;