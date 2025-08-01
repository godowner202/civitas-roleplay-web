import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, Users, Car, Home, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseAnalysis {
  framework: string;
  totalTables: number;
  playerRelatedTables: string[];
  tables: Record<string, any>;
  summary: {
    hasUsers: boolean;
    hasJobs: boolean;
    hasVehicles: boolean;
    hasProperties: boolean;
    hasInventory: boolean;
    hasMoney: boolean;
    identifierColumns: Array<{
      table: string;
      column: string;
      type: string;
    }>;
  };
}

const FiveMDatabaseAnalyzer = () => {
  const [analysis, setAnalysis] = useState<DatabaseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeFiveMDatabase = async () => {
    setLoading(true);
    try {
      console.log('Calling FiveM database analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-fivem-db', {
        body: {}
      });

      if (error) {
        console.error('Error analyzing database:', error);
        toast({
          title: "Database Analysis Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Database analysis result:', data);
      setAnalysis(data);
      
      toast({
        title: "Database Analysis Complete",
        description: `Found ${data.totalTables} tables with framework: ${data.framework}`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze FiveM database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">FiveM Database Analysis</h1>
        <p className="text-muted-foreground">
          Analyze your FiveM server database to prepare for player stats integration
        </p>
        
        <Button 
          onClick={analyzeFiveMDatabase} 
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Analyze FiveM Database
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Framework Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{analysis.framework}</p>
                  <p className="text-sm text-muted-foreground">Framework</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{analysis.totalTables}</p>
                  <p className="text-sm text-muted-foreground">Total Tables</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{analysis.playerRelatedTables.length}</p>
                  <p className="text-sm text-muted-foreground">Player Tables</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{analysis.summary.identifierColumns.length}</p>
                  <p className="text-sm text-muted-foreground">Identifiers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Available */}
          <Card>
            <CardHeader>
              <CardTitle>Available Features</CardTitle>
              <CardDescription>Data types available in your FiveM database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                  <Badge variant={analysis.summary.hasUsers ? "default" : "secondary"}>
                    {analysis.summary.hasUsers ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Jobs</span>
                  <Badge variant={analysis.summary.hasJobs ? "default" : "secondary"}>
                    {analysis.summary.hasJobs ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Vehicles</span>
                  <Badge variant={analysis.summary.hasVehicles ? "default" : "secondary"}>
                    {analysis.summary.hasVehicles ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Properties</span>
                  <Badge variant={analysis.summary.hasProperties ? "default" : "secondary"}>
                    {analysis.summary.hasProperties ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Inventory</span>
                  <Badge variant={analysis.summary.hasInventory ? "default" : "secondary"}>
                    {analysis.summary.hasInventory ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Money</span>
                  <Badge variant={analysis.summary.hasMoney ? "default" : "secondary"}>
                    {analysis.summary.hasMoney ? "Available" : "Missing"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Player-Related Tables */}
          <Card>
            <CardHeader>
              <CardTitle>Player-Related Tables</CardTitle>
              <CardDescription>Tables that contain player/character data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {analysis.playerRelatedTables.map((tableName) => (
                  <Badge key={tableName} variant="outline" className="justify-center">
                    {tableName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Identifier Columns */}
          {analysis.summary.identifierColumns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Player Identifiers</CardTitle>
                <CardDescription>Columns used to identify players</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.summary.identifierColumns.map((identifier, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-medium">{identifier.table}.{identifier.column}</span>
                      <Badge variant="secondary">{identifier.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Data (for debugging) */}
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Show Raw Analysis Data (Debug)
            </summary>
            <pre className="mt-2 p-4 bg-muted/50 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default FiveMDatabaseAnalyzer;