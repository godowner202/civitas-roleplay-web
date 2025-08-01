import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Award, 
  DollarSign, 
  Users, 
  RefreshCw,
  TrendingUp,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerRanking {
  license: string;
  firstname: string;
  lastname: string;
  citizenid: string;
  cash: number;
  bank: number;
  total_money: number;
  job: any;
  rank: number;
}

const Leaderboards = () => {
  const [moneyLeaderboard, setMoneyLeaderboard] = useState<PlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      setLoading(true);
      
      // Get top players by money
      const { data: players, error } = await supabase
        .from('fivem_players')
        .select('license, firstname, lastname, citizenid, cash, bank, job')
        .not('firstname', 'is', null)
        .not('lastname', 'is', null)
        .order('bank', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Calculate total money and add ranking
      const playersWithTotal = (players || []).map((player, index) => ({
        ...player,
        total_money: (player.cash || 0) + (player.bank || 0),
        rank: index + 1
      }));

      // Sort by total money
      playersWithTotal.sort((a, b) => b.total_money - a.total_money);
      
      // Update ranks after sorting
      playersWithTotal.forEach((player, index) => {
        player.rank = index + 1;
      });

      setMoneyLeaderboard(playersWithTotal);
      
    } catch (error) {
      console.error('Error loading leaderboards:', error);
      toast({
        title: "Laden mislukt",
        description: "Kon leaderboards niet laden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboards = async () => {
    setRefreshing(true);
    try {
      await loadLeaderboards();
      toast({
        title: "Leaderboards bijgewerkt",
        description: "Alle rankings zijn vernieuwd",
      });
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-yellow-50 border-yellow-600";
      case 2:
        return "bg-gray-400 text-gray-50 border-gray-500";
      case 3:
        return "bg-orange-500 text-orange-50 border-orange-600";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
          <LoadingSpinner size="lg" text="Leaderboards laden..." />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
        <div className="container mx-auto p-6 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Leaderboards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bekijk de beste spelers van onze server
            </p>
            <Button 
              onClick={refreshLeaderboards} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? <LoadingSpinner size="sm" text="" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Vernieuwen
            </Button>
          </div>

          <Tabs defaultValue="money" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="money" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Rijkste Spelers
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2" disabled>
                <Users className="h-4 w-4" />
                Job Rankings
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2" disabled>
                <TrendingUp className="h-4 w-4" />
                Most Active
              </TabsTrigger>
            </TabsList>

            <TabsContent value="money" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Top Spelers - Totaal Vermogen
                  </CardTitle>
                  <CardDescription>
                    Gerangschikt op totaal geld (contant + bank)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moneyLeaderboard.slice(0, 20).map((player) => (
                      <div 
                        key={player.license}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          player.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-transparent border-primary/20' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 min-w-[60px]">
                              {getRankIcon(player.rank)}
                              {player.rank > 3 && (
                                <Badge className={getRankBadgeColor(player.rank)}>
                                  #{player.rank}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">
                                {player.firstname} {player.lastname}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Citizen ID: {player.citizenid}
                              </p>
                              {player.job && (
                                <p className="text-xs text-muted-foreground">
                                  {JSON.parse(player.job)?.label || 'Werkloos'}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <p className="text-2xl font-bold text-primary">
                              {formatMoney(player.total_money)}
                            </p>
                            <div className="text-sm text-muted-foreground space-y-0.5">
                              <p>💰 {formatMoney(player.cash || 0)}</p>
                              <p>🏦 {formatMoney(player.bank || 0)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {moneyLeaderboard.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Geen leaderboard data beschikbaar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Rankings</CardTitle>
                  <CardDescription>
                    Binnenkort beschikbaar - Rankings per baan categorie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Deze functie wordt binnenkort toegevoegd</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Rankings</CardTitle>
                  <CardDescription>
                    Binnenkort beschikbaar - Most active spelers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Deze functie wordt binnenkort toegevoegd</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Leaderboards;