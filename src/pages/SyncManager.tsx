import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Database, Clock, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SyncStats {
  total_fivem_players: number;
  synced_players: number;
  errors: number;
  sync_completed_at: string;
}

const SyncManager = () => {
  const [loading, setLoading] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSync = async () => {
    setLoading(true);
    try {
      console.log('Starting FiveM data sync...');
      
      const { data, error } = await supabase.functions.invoke('sync-fivem-data', {
        body: {}
      });

      if (error) {
        console.error('Sync error:', error);
        toast({
          title: "Sync mislukt",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Sync completed:', data);
      setSyncStats(data.stats);
      setErrors(data.errors || []);
      
      toast({
        title: "Sync voltooid!",
        description: `${data.stats.synced_players} spelers gesynchroniseerd`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Sync failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL');
  };

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen">
      <div className="text-center space-y-4">
        <Database className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold">FiveM Data Sync Manager</h1>
        <p className="text-muted-foreground">
          Synchroniseer FiveM player data naar Supabase database
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Data Synchronisatie
          </CardTitle>
          <CardDescription>
            Kopieer alle player data van FiveM database naar Supabase voor snellere toegang
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Automatische sync:</strong> Deze functie draait normaal elke 3 uur automatisch. 
              Hier kun je handmatig syncen voor testing.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleSync} 
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Synchroniseren...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Handmatige Sync
              </>
            )}
          </Button>

          {syncStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">FiveM Spelers</p>
                  <p className="text-2xl font-bold text-blue-600">{syncStats.total_fivem_players}</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Gesynchroniseerd</p>
                  <p className="text-2xl font-bold text-green-600">{syncStats.synced_players}</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Database className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="text-sm text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{syncStats.errors}</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600">Laatste Sync</p>
                  <p className="text-xs font-medium text-gray-600">
                    {formatDate(syncStats.sync_completed_at)}
                  </p>
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Sync voltooid!</strong> {syncStats.synced_players} van {syncStats.total_fivem_players} spelers 
                  succesvol gesynchroniseerd naar Supabase database.
                </AlertDescription>
              </Alert>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Errors ({errors.length}):</strong>
                    <ul className="mt-2 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">• {error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" asChild className="flex-1">
              <a href="/character-koppeling">→ Character Koppeling</a>
            </Button>
            
            <Button variant="outline" asChild className="flex-1">
              <a href="/mijn-stats">→ Mijn Stats Testen</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Over de Nieuwe Architectuur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">✅ Voordelen:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Veel snellere response times</li>
                <li>• Betere beveiliging (RLS policies)</li>
                <li>• Geen externe database calls</li>
                <li>• Automatische sync elke 3 uur</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🔄 Sync Details:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Data wordt elke 3 uur geüpdatet</li>
                <li>• Nieuwe spelers binnen 3 uur zichtbaar</li>
                <li>• JSON data wordt automatisch geparsed</li>
                <li>• Generated columns voor snelle queries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncManager;