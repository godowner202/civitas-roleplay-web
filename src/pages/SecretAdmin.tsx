import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Upload, Settings, Users, Calendar, Image as ImageIcon, AlertTriangle, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AVAILABLE_TAGS = [
  "Server Update", "Bug Fix", "Nieuwe Feature", "Event", 
  "Maintenance", "Hotfix", "Quality of Life", "Balance Update"
];

const SecretAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("updates");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUpdates();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === "CivitasRP2024!") {
      setIsAuthenticated(true);
      toast.success("Ingelogd als admin!");
    } else {
      toast.error("Verkeerd wachtwoord");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("server_updates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error: any) {
      toast.error("Fout bij ophalen updates: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async () => {
    setSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (uploadedImage) {
        const timestamp = Date.now();
        const fileName = `update_${timestamp}_${uploadedImage.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('update-images')
          .upload(fileName, uploadedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('update-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("server_updates")
        .insert({
          title: updateTitle,
          content: updateContent,
          tags: selectedTags,
          image_url: imageUrl,
          author_id: "00000000-0000-0000-0000-000000000000", // Dummy UUID for admin
        });

      if (error) throw error;

      toast.success("Update succesvol gepost!");
      setUpdateTitle("");
      setUpdateContent("");
      setSelectedTags([]);
      setUploadedImage(null);
      setImagePreview(null);
      fetchUpdates();
    } catch (error: any) {
      toast.error("Fout bij posten update: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("server_updates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Update verwijderd!");
      fetchUpdates();
    } catch (error: any) {
      toast.error("Fout bij verwijderen: " + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <p className="text-muted-foreground">Toegang voor beheerders alleen</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                required
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Inloggen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Civitas RP Admin Panel</h1>
            <p className="text-muted-foreground">Beheer je server content en instellingen</p>
          </div>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Uitloggen
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="discord">Discord</TabsTrigger>
          </TabsList>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nieuwe Update Plaatsen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => selectedTags.includes(tag) ? removeTag(tag) : addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Afbeelding (optioneel)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        Selecteer afbeelding
                      </div>
                    </Label>
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <X 
                          className="absolute -top-2 -right-2 h-4 w-4 bg-destructive text-destructive-foreground rounded-full cursor-pointer"
                          onClick={() => {
                            setUploadedImage(null);
                            setImagePreview(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={handleSubmitUpdate} disabled={submitting} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {submitting ? "Bezig..." : "Update Plaatsen"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bestaande Updates Beheren</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Laden...</p>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="border rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{update.title}</h3>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteUpdate(update.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(update.created_at).toLocaleDateString("nl-NL")}
                        </p>
                        {update.tags && update.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {update.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {update.image_url && (
                          <img 
                            src={update.image_url} 
                            alt="Update afbeelding" 
                            className="w-full max-w-md h-32 object-cover rounded mb-2"
                          />
                        )}
                        <p className="text-sm">{update.content}</p>
                      </div>
                    ))}
                    {updates.length === 0 && (
                      <p className="text-muted-foreground">Geen updates gevonden.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Gallery Beheer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Gallery management met lightbox functionaliteit wordt binnenkort toegevoegd.
                    Features: Upload afbeeldingen, video's en GIFs, beheer gallery items, lightbox weergave.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Team member management wordt binnenkort toegevoegd.
                    Features: Toevoegen/bewerken/verwijderen team members, avatar upload, rol management.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Events & Calendar Beheer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Live server events calendar wordt binnenkort toegevoegd.
                    Features: Event planning, recurring events, calendar weergave, notifications.
                    Database tabellen zijn al aangemaakt!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Instellingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Site settings worden binnenkort toegevoegd.
                    Features: Maintenance mode, site-wide announcements, server configuratie.
                    Database tabellen zijn al aangemaakt!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discord Tab */}
          <TabsContent value="discord" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Discord Widget & Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Discord widget om online members te tonen wordt binnenkort toegevoegd.
                    Features: Live member count, online status, Discord server stats.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecretAdmin;