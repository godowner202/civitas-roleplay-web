import { useState, useEffect } from "react";
import { Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const getTagColor = (tag: string) => {
  const colors: { [key: string]: string } = {
    'onderhoud': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'nieuwe-feature': 'bg-green-100 text-green-800 border-green-200',
    'bugfix': 'bg-red-100 text-red-800 border-red-200',
    'update': 'bg-blue-100 text-blue-800 border-blue-200',
    'event': 'bg-purple-100 text-purple-800 border-purple-200',
    'changelog': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const Updates = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("server_updates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Server Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Blijf op de hoogte van alle nieuwe features, verbeteringen en updates voor Civitas RP.
          </p>
        </div>

        {/* Development Status */}
        <div className="mb-12">
          <Card className="bg-gradient-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                  🚧 In Development
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Civitas RP is momenteel in ontwikkeling
              </h2>
              <p className="text-muted-foreground">
                We werken hard aan het perfectioneren van alle systemen. Volg onze Discord voor real-time updates!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <p>Updates laden...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Geen updates beschikbaar.</p>
            </div>
          ) : (
            updates.map((update) => (
              <Card key={update.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{update.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(update.created_at).toLocaleDateString("nl-NL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {update.tags && update.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {update.tags.map((tag: string) => (
                        <Badge key={tag} className={getTagColor(tag)}>
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  {update.image_url && (
                    <img 
                      src={update.image_url} 
                      alt="Update afbeelding" 
                      className="w-full max-w-2xl h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-muted-foreground mb-4">{update.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Mis geen update!</h2>
            <p className="text-muted-foreground mb-6">
              Word lid van onze Discord community om als eerste op de hoogte te zijn van nieuwe updates, 
              events en ontwikkelingen.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Real-time updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">Community feedback</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Updates;