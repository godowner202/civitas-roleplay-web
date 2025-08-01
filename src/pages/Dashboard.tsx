import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Wallet, 
  Clock, 
  TrendingUp, 
  Activity,
  Star,
  Users,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerData {
  license: string;
  firstname: string;
  lastname: string;
  citizenid: string;
  money: any;
  job: any;
  charinfo: any;
  cash: number;
  bank: number;
  synced_at?: string;
}

interface PlayerAccount {
  id: string;
  fivem_license: string;
  character_name: string | null;
  verified: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [playerAccount, setPlayerAccount] = useState<PlayerAccount | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      await loadPlayerData(session.user.id);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerData = async (userId: string) => {
    try {
      // Get linked player account
      const { data: account, error: accountError } = await supabase
        .from('player_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('verified', true)
        .maybeSingle();

      if (accountError) throw accountError;
      
      if (!account) {
        return; // No linked character
      }

      setPlayerAccount(account);

      // Get player data from FiveM
      const { data: playerData, error: playerError } = await supabase
        .from('fivem_players')
        .select('*')
        .eq('license', account.fivem_license)
        .maybeSingle();

      if (playerError) throw playerError;
      
      setPlayerData(playerData);
    } catch (error) {
      console.error('Error loading player data:', error);
      toast({
        title: "Laden mislukt",
        description: "Kon je character data niet laden",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      await loadPlayerData(user.id);
      toast({
        title: "Data vernieuwd",
        description: "Je character informatie is bijgewerkt",
      });
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
          <LoadingSpinner size="lg" text="Dashboard laden..." />
        </div>
        <Footer />
      </>
    );
  }

  if (!playerAccount) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
          <div className="container mx-auto p-6 text-center space-y-8">
            <div className="space-y-4">
              <User className="h-16 w-16 mx-auto text-muted-foreground" />
              <h1 className="text-3xl font-bold">Welkom bij je Dashboard</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Je hebt nog geen FiveM character gekoppeld aan je account. 
                Koppel eerst je character om toegang te krijgen tot je persoonlijke dashboard.
              </p>
            </div>
            <Button onClick={() => navigate('/character-koppeling')} size="lg">
              Character Koppelen
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const totalMoney = (playerData?.cash || 0) + (playerData?.bank || 0);
  const jobInfo = playerData?.job ? JSON.parse(playerData.job) : null;
  const charInfo = playerData?.charinfo ? JSON.parse(playerData.charinfo) : null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
        <div className="container mx-auto p-6 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Jouw Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welkom terug, {playerData?.firstname} {playerData?.lastname}!
            </p>
            <Button 
              onClick={refreshData} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? <LoadingSpinner size="sm" text="" /> : "Data Vernieuwen"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Character Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Character Informatie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Naam</p>
                    <p className="font-medium">{playerData?.firstname} {playerData?.lastname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Citizen ID</p>
                    <p className="font-mono text-sm">{playerData?.citizenid}</p>
                  </div>
                  {charInfo?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefoon</p>
                      <p className="font-mono text-sm">{charInfo.phone}</p>
                    </div>
                  )}
                  {charInfo?.birthdate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Geboortedatum</p>
                      <p className="text-sm">{charInfo.birthdate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    <Star className="h-3 w-3 mr-1" />
                    Actieve Speler
                  </Badge>
                  <p className="text-2xl font-bold text-primary">
                    {formatMoney(totalMoney)}
                  </p>
                  <p className="text-sm text-muted-foreground">Totaal Vermogen</p>
                </div>
              </CardContent>
            </Card>

            {/* Money Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Geld Overzicht
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Contant</span>
                    <span className="font-medium">{formatMoney(playerData?.cash || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bank</span>
                    <span className="font-medium">{formatMoney(playerData?.bank || 0)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Totaal</span>
                      <span className="font-bold text-primary">{formatMoney(totalMoney)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Info */}
            {jobInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Werk Informatie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Baan</p>
                      <p className="font-medium capitalize">{jobInfo.label || jobInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rang</p>
                      <p className="text-sm">{jobInfo.grade?.name || 'Onbekend'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salaris</p>
                      <p className="text-sm">{formatMoney(jobInfo.grade?.payment || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recente Activiteit
                </CardTitle>
                <CardDescription>
                  Je laatste server activiteiten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Character gekoppeld</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(playerAccount.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Laatste sync</p>
                      <p className="text-xs text-muted-foreground">
                        {playerData?.synced_at ? 
                          new Date(playerData.synced_at).toLocaleDateString('nl-NL') : 
                          'Onbekend'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => navigate('/stats')} variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Server Status
            </Button>
            <Button onClick={() => navigate('/character-koppeling')} variant="outline">
              <User className="h-4 w-4 mr-2" />
              Character Beheren
            </Button>
            <Button onClick={() => navigate('/gallery')} variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Galerij
            </Button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;