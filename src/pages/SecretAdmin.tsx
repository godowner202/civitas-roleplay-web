import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AVAILABLE_TAGS = [
  "onderhoud",
  "nieuwe-feature", 
  "bugfix",
  "update",
  "event",
  "changelog"
];

const SecretAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "CivitasRP" && password === "Delangn124?") {
      setIsAuthenticated(true);
      toast.success("Ingelogd als admin!");
    } else {
      toast.error("Verkeerde inloggegevens");
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

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Admin Login
                </CardTitle>
                <p className="text-muted-foreground">
                  Toegang voor beheerders alleen
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Gebruikersnaam</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Wachtwoord</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Inloggen
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
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
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
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

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Select onValueChange={addTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_TAGS.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
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
                
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Bezig..." : "Update Posten"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Manage Updates */}
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{update.title}</h3>
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
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUpdate(update.id)}
                        >
                          Verwijder
                        </Button>
                      </div>
                    </div>
                  ))}
                  {updates.length === 0 && (
                    <p className="text-muted-foreground">Geen updates gevonden.</p>
                  )}
                </div>
              )}
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

export default SecretAdmin;