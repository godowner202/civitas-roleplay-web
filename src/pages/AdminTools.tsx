import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [licenseToRemove, setLicenseToRemove] = useState("f5978867efbc294bd764502ab5c854aeefa1c9c9");
  const { toast } = useToast();

  const handleRemoveLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Removing license:', licenseToRemove);
      
      const { data, error } = await supabase.functions.invoke('remove-license', {
        body: { license: licenseToRemove.trim() }
      });

      if (error) {
        console.error('Error removing license:', error);
        toast({
          title: "Verwijderen mislukt",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('License removed successfully:', data);
      toast({
        title: "License verwijderd!",
        description: `License ${licenseToRemove} is verwijderd uit de database`,
      });

      setLicenseToRemove("");

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Kon license niet verwijderen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen">
      <div className="text-center space-y-4">
        <Shield className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-3xl font-bold text-red-600">Admin Tools</h1>
        <p className="text-muted-foreground">
          Verwijder gekoppelde licenses voor testing
        </p>
      </div>

      <Card className="max-w-2xl mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            License Verwijderen
          </CardTitle>
          <CardDescription>
            Verwijder een license uit player_accounts tabel (voor testing)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-red-200 bg-red-50">
            <Trash2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Waarschuwing:</strong> Dit verwijdert de license permanent uit de player_accounts tabel. 
              Gebruik dit alleen voor testing!
            </AlertDescription>
          </Alert>

          <form onSubmit={handleRemoveLicense} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="license">FiveM License om te verwijderen</Label>
              <Input
                id="license"
                placeholder="f5978867efbc294bd764502ab5c854aeefa1c9c9"
                value={licenseToRemove}
                onChange={(e) => setLicenseToRemove(e.target.value)}
                required
                disabled={loading}
                className="font-mono"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading || !licenseToRemove.trim()}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verwijderen...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  License Verwijderen
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <a href="/character-koppeling">→ Naar Character Koppeling</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTools;