import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, User, DollarSign, Briefcase, Car, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PlayerData {
  identifier: string;
  name: string;
  firstname?: string;
  lastname?: string;
  money?: number;
  bank?: number;
  job?: string;
  job_grade?: number;
  job_grade_name?: string;
  last_seen?: string;
  playtime?: number;
  vehicles?: any[];
  jobData?: any;
  [key: string]: any;
}

const PlayerStats = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  // Load all players on component mount
  useEffect(() => {
    loadAllPlayers();
  }, []);

  const loadAllPlayers = async () => {
    setLoading(true);
    try {
      console.log('Loading all players...');
      
      const { data, error } = await supabase.functions.invoke('get-player-stats', {
        body: {}
      });

      if (error) {
        console.error('Error loading players:', error);
        toast({
          title: "Error Loading Players",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Players loaded:', data);
      setPlayers(data.players || []);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load players",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchPlayer = async () => {
    if (!searchId.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a player identifier (Steam, License, Discord, etc.)",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      console.log('Searching for player:', searchId);
      
      const { data, error } = await supabase.functions.invoke('get-player-stats', {
        body: { playerId: searchId.trim() }
      });

      if (error) {
        console.error('Error searching player:', error);
        toast({
          title: "Player Not Found",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Player found:', data);
      setSelectedPlayer(data);
      
      toast({
        title: "Player Found",
        description: `Loaded stats for ${data.name || data.firstname || 'Unknown Player'}`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for player",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const formatMoney = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString('nl-NL');
    } catch {
      return dateString;
    }
  };

  const formatPlaytime = (seconds: number | undefined) => {
    if (!seconds) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6 min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Player Statistics</h1>
          <p className="text-muted-foreground">
            View player stats from your FiveM server
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Player
            </CardTitle>
            <CardDescription>
              Search by Steam ID, License, Discord ID, or any player identifier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter player identifier (steam:, license:, discord:, etc.)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPlayer()}
              />
              <Button onClick={searchPlayer} disabled={searching}>
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Player Details */}
        {selectedPlayer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Player Details: {selectedPlayer.name || selectedPlayer.firstname || 'Unknown'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Cash</p>
                  <p className="text-lg font-bold">{formatMoney(selectedPlayer.money)}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <p className="text-lg font-bold">{formatMoney(selectedPlayer.bank)}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded">
                  <Briefcase className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-muted-foreground">Job</p>
                  <p className="text-lg font-bold">{selectedPlayer.job || 'Unemployed'}</p>
                  {selectedPlayer.job_grade_name && (
                    <p className="text-sm text-muted-foreground">{selectedPlayer.job_grade_name}</p>
                  )}
                </div>
                <div className="text-center p-4 bg-muted/50 rounded">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm text-muted-foreground">Playtime</p>
                  <p className="text-lg font-bold">{formatPlaytime(selectedPlayer.playtime)}</p>
                </div>
              </div>

              {/* Additional Player Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Player Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedPlayer.firstname} {selectedPlayer.lastname}</p>
                    <p><strong>Identifier:</strong> {selectedPlayer.identifier}</p>
                    <p><strong>Last Seen:</strong> {formatDate(selectedPlayer.last_seen)}</p>
                  </div>
                </div>

                {selectedPlayer.vehicles && selectedPlayer.vehicles.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vehicles ({selectedPlayer.vehicles.length})
                    </h4>
                    <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                      {selectedPlayer.vehicles.slice(0, 5).map((vehicle, index) => (
                        <p key={index}>
                          <Badge variant="outline">{vehicle.model || vehicle.vehicle || 'Unknown'}</Badge>
                          {vehicle.plate && <span className="ml-2 text-muted-foreground">({vehicle.plate})</span>}
                        </p>
                      ))}
                      {selectedPlayer.vehicles.length > 5 && (
                        <p className="text-muted-foreground">+{selectedPlayer.vehicles.length - 5} more...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw Player Data (Debug) */}
              <details>
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Show Raw Player Data (Debug)
                </summary>
                <pre className="mt-2 p-4 bg-muted/50 rounded text-xs overflow-auto max-h-48">
                  {JSON.stringify(selectedPlayer, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* All Players Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Recent Players
              </span>
              <Button onClick={loadAllPlayers} disabled={loading} variant="outline">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Last 50 players ordered by most recent activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading players...</p>
              </div>
            ) : players.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Money</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.slice(0, 20).map((player, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {player.name || `${player.firstname || ''} ${player.lastname || ''}`.trim() || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.job || 'Unemployed'}</Badge>
                        </TableCell>
                        <TableCell>{formatMoney(player.money)}</TableCell>
                        <TableCell>{formatMoney(player.bank)}</TableCell>
                        <TableCell className="text-sm">{formatDate(player.last_seen)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPlayer(player)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No players found. Click "Refresh" to load players from your database.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default PlayerStats;