import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User } from "@supabase/supabase-js";

const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
      } else {
        toast.error("Je hebt geen admin rechten");
        navigate("/");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("server_updates")
        .insert({
          title: updateTitle,
          content: updateContent,
          author_id: user!.id,
        });

      if (error) throw error;

      toast.success("Update succesvol gepost!");
      setUpdateTitle("");
      setUpdateContent("");
    } catch (error: any) {
      toast.error("Fout bij posten update: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <p>Geen toegang</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            Uitloggen
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Post Update */}
          <Card>
            <CardHeader>
              <CardTitle>Server Update Posten</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="Update titel..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Inhoud</Label>
                  <Textarea
                    id="content"
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    placeholder="Update inhoud..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Bezig..." : "Update Posten"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Gallery Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Beheer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gallery upload functionaliteit komt binnenkort...
              </p>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader>
              <CardTitle>Team Beheer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Team beheerfunctionaliteit komt binnenkort...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;