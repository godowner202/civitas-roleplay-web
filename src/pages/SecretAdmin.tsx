import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, Upload, Settings, Users, Calendar, Image as ImageIcon, 
  AlertTriangle, Plus, Save, Trash2, Edit, ZoomIn, Play, 
  Bell
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AVAILABLE_TAGS = [
  "Server Update", "Bug Fix", "Nieuwe Feature", "Event", 
  "Maintenance", "Hotfix", "Quality of Life", "Balance Update"
];

const EVENT_TYPES = [
  "general", "server_restart", "maintenance", "event", "competition", "meeting"
];

interface ServerUpdate {
  id: string;
  title: string;
  content: string;
  tags: string[];
  image_url?: string;
  created_at: string;
  author_id: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  avatar_url?: string;
  order_index: number;
}

interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  media_url: string;
  media_type: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  event_type: string;
  is_recurring: boolean;
}

interface SiteSettings {
  maintenance_mode: {
    enabled: boolean;
    message: string;
  };
  announcement: {
    enabled: boolean;
    message: string;
    type: string;
  };
}

const SecretAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("updates");

  // Updates state
  const [updates, setUpdates] = useState<ServerUpdate[]>([]);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDescription, setNewGalleryDescription] = useState("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamAvatar, setTeamAvatar] = useState<File | null>(null);
  const [teamAvatarPreview, setTeamAvatarPreview] = useState<string | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventType, setEventType] = useState("general");
  const [eventRecurring, setEventRecurring] = useState(false);

  // Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    maintenance_mode: { enabled: false, message: "We are performing scheduled maintenance. Please check back soon!" },
    announcement: { enabled: false, message: "", type: "info" }
  });

  const handleLogin = () => {
    if (password === "CivitasRP2024!") {
      setIsAuthenticated(true);
      toast.success("Ingelogd als admin!");
    } else {
      toast.error("Verkeerd wachtwoord");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUpdates();
      fetchGalleryItems();
      fetchTeamMembers();
      fetchEvents();
      fetchSiteSettings();
    }
  }, [isAuthenticated]);

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

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error: any) {
      toast.error("Fout bij ophalen gallery items: " + error.message);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error: any) {
      toast.error("Fout bij ophalen team members: " + error.message);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error("Fout bij ophalen events: " + error.message);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      
      if (error) throw error;
      
      const settings: any = {
        maintenance_mode: { enabled: false, message: "We are performing scheduled maintenance. Please check back soon!" },
        announcement: { enabled: false, message: "", type: "info" }
      };
      
      data?.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });
      
      setSiteSettings(settings);
    } catch (error: any) {
      toast.error("Fout bij ophalen site settings: " + error.message);
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

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTeamAvatarPreview(e.target?.result as string);
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

  const handleSubmitUpdate = async () => {
    setSubmitting(true);
    try {
      let imageUrl = null;

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
          author_id: "00000000-0000-0000-0000-000000000000",
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

  const handleSubmitGalleryItem = async () => {
    if (!galleryFile) {
      toast.error("Selecteer een bestand");
      return;
    }

    try {
      const timestamp = Date.now();
      const fileExt = galleryFile.name.split('.').pop();
      const fileName = `gallery_${timestamp}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery-media')
        .upload(fileName, galleryFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-media')
        .getPublicUrl(fileName);

      const mediaType = galleryFile.type.startsWith('video/') ? 'video' : 
                       galleryFile.type.startsWith('image/') ? 'image' : 'other';

      const { error } = await supabase
        .from("gallery_items")
        .insert({
          title: newGalleryTitle || null,
          description: newGalleryDescription || null,
          media_url: publicUrl,
          media_type: mediaType
        });

      if (error) throw error;

      toast.success("Gallery item toegevoegd!");
      setNewGalleryTitle("");
      setNewGalleryDescription("");
      setGalleryFile(null);
      setGalleryPreview(null);
      fetchGalleryItems();
    } catch (error: any) {
      toast.error("Fout bij uploaden: " + error.message);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Gallery item verwijderd!");
      fetchGalleryItems();
    } catch (error: any) {
      toast.error("Fout bij verwijderen: " + error.message);
    }
  };

  const handleSubmitTeamMember = async () => {
    if (!teamName || !teamRole) {
      toast.error("Naam en rol zijn verplicht");
      return;
    }

    try {
      let avatarUrl = null;

      if (teamAvatar) {
        const timestamp = Date.now();
        const fileName = `team_${timestamp}_${teamAvatar.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery-media')
          .upload(fileName, teamAvatar);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery-media')
          .getPublicUrl(fileName);
        
        avatarUrl = publicUrl;
      }

      if (editingTeamMember) {
        const { error } = await supabase
          .from("team_members")
          .update({
            name: teamName,
            role: teamRole,
            description: teamDescription || null,
            avatar_url: avatarUrl || editingTeamMember.avatar_url
          })
          .eq("id", editingTeamMember.id);

        if (error) throw error;
        toast.success("Team member bijgewerkt!");
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert({
            name: teamName,
            role: teamRole,
            description: teamDescription || null,
            avatar_url: avatarUrl,
            order_index: teamMembers.length
          });

        if (error) throw error;
        toast.success("Team member toegevoegd!");
      }

      setTeamName("");
      setTeamRole("");
      setTeamDescription("");
      setTeamAvatar(null);
      setTeamAvatarPreview(null);
      setEditingTeamMember(null);
      fetchTeamMembers();
    } catch (error: any) {
      toast.error("Fout bij opslaan: " + error.message);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Team member verwijderd!");
      fetchTeamMembers();
    } catch (error: any) {
      toast.error("Fout bij verwijderen: " + error.message);
    }
  };

  const editTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamName(member.name);
    setTeamRole(member.role);
    setTeamDescription(member.description || "");
    setActiveTab("team");
  };

  const handleSubmitEvent = async () => {
    if (!eventTitle || !eventDate) {
      toast.error("Titel en datum zijn verplicht");
      return;
    }

    try {
      const { error } = await supabase
        .from("events")
        .insert({
          title: eventTitle,
          description: eventDescription || null,
          event_date: eventDate,
          end_date: eventEndDate || null,
          event_type: eventType,
          is_recurring: eventRecurring,
          created_by: "00000000-0000-0000-0000-000000000000"
        });

      if (error) throw error;

      toast.success("Event toegevoegd!");
      setEventTitle("");
      setEventDescription("");
      setEventDate("");
      setEventEndDate("");
      setEventType("general");
      setEventRecurring(false);
      fetchEvents();
    } catch (error: any) {
      toast.error("Fout bij toevoegen event: " + error.message);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Event verwijderd!");
      fetchEvents();
    } catch (error: any) {
      toast.error("Fout bij verwijderen: " + error.message);
    }
  };

  const updateSiteSettings = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_by: "00000000-0000-0000-0000-000000000000"
        });

      if (error) throw error;

      setSiteSettings(prev => ({
        ...prev,
        [key]: value
      }));

      toast.success("Settings bijgewerkt!");
    } catch (error: any) {
      toast.error("Fout bij bijwerken settings: " + error.message);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                  Gallery Item Toevoegen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gallery-title">Titel (optioneel)</Label>
                  <Input
                    id="gallery-title"
                    value={newGalleryTitle}
                    onChange={(e) => setNewGalleryTitle(e.target.value)}
                    placeholder="Titel voor dit item..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gallery-description">Beschrijving (optioneel)</Label>
                  <Textarea
                    id="gallery-description"
                    value={newGalleryDescription}
                    onChange={(e) => setNewGalleryDescription(e.target.value)}
                    placeholder="Beschrijving..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gallery-file">Media Bestand (afbeelding, video, GIF)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="gallery-file"
                      type="file"
                      accept="image/*,video/*,.gif"
                      onChange={handleGalleryFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="gallery-file" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        Selecteer bestand
                      </div>
                    </Label>
                    {galleryPreview && (
                      <div className="relative">
                        {galleryFile?.type.startsWith('video/') ? (
                          <video 
                            src={galleryPreview} 
                            className="h-20 w-20 object-cover rounded border"
                            controls
                          />
                        ) : (
                          <img 
                            src={galleryPreview} 
                            alt="Preview" 
                            className="h-20 w-20 object-cover rounded border"
                          />
                        )}
                        <X 
                          className="absolute -top-2 -right-2 h-4 w-4 bg-destructive text-destructive-foreground rounded-full cursor-pointer"
                          onClick={() => {
                            setGalleryFile(null);
                            setGalleryPreview(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={handleSubmitGalleryItem} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Gallery Item Toevoegen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery Items Beheren</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="border rounded p-4">
                      <div className="aspect-video mb-2 relative group">
                        {item.media_type === 'video' ? (
                          <video 
                            src={item.media_url} 
                            className="w-full h-full object-cover rounded"
                            controls
                          />
                        ) : (
                          <>
                            <img 
                              src={item.media_url} 
                              alt={item.title || "Gallery item"} 
                              className="w-full h-full object-cover rounded cursor-pointer"
                              onClick={() => setSelectedGalleryImage(item.media_url)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center rounded">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </>
                        )}
                      </div>
                      {item.title && <h3 className="font-semibold mb-1">{item.title}</h3>}
                      {item.description && <p className="text-sm text-muted-foreground mb-2">{item.description}</p>}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString("nl-NL")}
                        </span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteGalleryItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {galleryItems.length === 0 && (
                  <p className="text-muted-foreground text-center">Geen gallery items gevonden.</p>
                )}
              </CardContent>
            </Card>

            {/* Lightbox */}
            {selectedGalleryImage && (
              <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedGalleryImage(null)}
              >
                <div className="relative max-w-7xl max-h-full">
                  <button
                    onClick={() => setSelectedGalleryImage(null)}
                    className="absolute -top-12 right-0 text-white hover:text-primary transition-colors p-2"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <img 
                    src={selectedGalleryImage}
                    alt="Full size"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {editingTeamMember ? "Team Member Bewerken" : "Team Member Toevoegen"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Naam</Label>
                  <Input
                    id="team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Naam van team member..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-role">Rol</Label>
                  <Input
                    id="team-role"
                    value={teamRole}
                    onChange={(e) => setTeamRole(e.target.value)}
                    placeholder="Bijv. Owner, Admin, Moderator..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-description">Beschrijving</Label>
                  <Textarea
                    id="team-description"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Beschrijving van de team member..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-avatar">Avatar (optioneel)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="team-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleTeamAvatarUpload}
                      className="hidden"
                    />
                    <Label htmlFor="team-avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        Selecteer avatar
                      </div>
                    </Label>
                    {(teamAvatarPreview || editingTeamMember?.avatar_url) && (
                      <div className="relative">
                        <img 
                          src={teamAvatarPreview || editingTeamMember?.avatar_url} 
                          alt="Avatar preview" 
                          className="h-20 w-20 object-cover rounded-full border"
                        />
                        {teamAvatarPreview && (
                          <X 
                            className="absolute -top-2 -right-2 h-4 w-4 bg-destructive text-destructive-foreground rounded-full cursor-pointer"
                            onClick={() => {
                              setTeamAvatar(null);
                              setTeamAvatarPreview(null);
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitTeamMember} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    {editingTeamMember ? "Bijwerken" : "Toevoegen"}
                  </Button>
                  {editingTeamMember && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingTeamMember(null);
                        setTeamName("");
                        setTeamRole("");
                        setTeamDescription("");
                        setTeamAvatar(null);
                        setTeamAvatarPreview(null);
                      }}
                    >
                      Annuleren
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members Beheren</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          {member.avatar_url && (
                            <img 
                              src={member.avatar_url} 
                              alt={member.name}
                              className="w-16 h-16 object-cover rounded-full"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-primary">{member.role}</p>
                            {member.description && (
                              <p className="text-sm text-muted-foreground mt-1">{member.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => editTeamMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-muted-foreground text-center">Geen team members gevonden.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Toevoegen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Titel</Label>
                  <Input
                    id="event-title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event titel..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="event-description">Beschrijving</Label>
                  <Textarea
                    id="event-description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Event beschrijving..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Start Datum & Tijd</Label>
                    <Input
                      id="event-date"
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-end-date">Eind Datum & Tijd (optioneel)</Label>
                    <Input
                      id="event-end-date"
                      type="datetime-local"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={eventRecurring}
                    onCheckedChange={setEventRecurring}
                  />
                  <Label htmlFor="recurring">Herhalend event</Label>
                </div>

                <Button onClick={handleSubmitEvent} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Event Toevoegen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events Beheren</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.event_date).toLocaleString("nl-NL")}
                            {event.end_date && ` - ${new Date(event.end_date).toLocaleString("nl-NL")}`}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{event.event_type}</Badge>
                            {event.is_recurring && <Badge variant="secondary">Herhalend</Badge>}
                          </div>
                          {event.description && (
                            <p className="text-sm mt-2">{event.description}</p>
                          )}
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-muted-foreground text-center">Geen events gevonden.</p>
                  )}
                </div>
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
              <CardContent className="space-y-6">
                {/* Maintenance Mode */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode" className="text-base font-semibold">
                      Maintenance Mode
                    </Label>
                    <Switch
                      id="maintenance-mode"
                      checked={siteSettings.maintenance_mode?.enabled || false}
                      onCheckedChange={(checked) => 
                        updateSiteSettings('maintenance_mode', {
                          ...siteSettings.maintenance_mode,
                          enabled: checked
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-message">Maintenance Bericht</Label>
                    <Textarea
                      id="maintenance-message"
                      value={siteSettings.maintenance_mode?.message || ''}
                      onChange={(e) => 
                        setSiteSettings(prev => ({
                          ...prev,
                          maintenance_mode: {
                            ...prev.maintenance_mode,
                            message: e.target.value
                          }
                        }))
                      }
                      onBlur={() => updateSiteSettings('maintenance_mode', siteSettings.maintenance_mode)}
                      placeholder="Bericht dat getoond wordt tijdens maintenance..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Announcements */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="announcement-enabled" className="text-base font-semibold">
                      Site Aankondiging
                    </Label>
                    <Switch
                      id="announcement-enabled"
                      checked={siteSettings.announcement?.enabled || false}
                      onCheckedChange={(checked) => 
                        updateSiteSettings('announcement', {
                          ...siteSettings.announcement,
                          enabled: checked
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcement-message">Aankondiging Bericht</Label>
                    <Textarea
                      id="announcement-message"
                      value={siteSettings.announcement?.message || ''}
                      onChange={(e) => 
                        setSiteSettings(prev => ({
                          ...prev,
                          announcement: {
                            ...prev.announcement,
                            message: e.target.value
                          }
                        }))
                      }
                      onBlur={() => updateSiteSettings('announcement', siteSettings.announcement)}
                      placeholder="Belangrijke aankondiging voor bezoekers..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Aankondiging Type</Label>
                    <Select 
                      value={siteSettings.announcement?.type || 'info'} 
                      onValueChange={(value) => updateSiteSettings('announcement', {
                        ...siteSettings.announcement,
                        type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Waarschuwing</SelectItem>
                        <SelectItem value="success">Succes</SelectItem>
                        <SelectItem value="error">Fout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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