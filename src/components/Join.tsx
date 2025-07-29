import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, UserPlus, MessageCircle, Play } from "lucide-react";

const Join = () => {
  return (
    <section id="join" className="py-20 bg-darker-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Hoe kan ik meedoen?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Het is heel eenvoudig om deel te worden van onze community. 
            Volg deze stappen en begin vandaag nog met jouw roleplay avontuur!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 text-center">
            <CardHeader>
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Stap 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Download en installeer FiveM vanaf de officiële website</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 text-center">
            <CardHeader>
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-lg">Stap 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Join onze Discord server en lees de welkomst berichten</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 text-center">
            <CardHeader>
              <div className="h-16 w-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-neon-green" />
              </div>
              <CardTitle className="text-lg">Stap 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Voltooi de whitelist procedure en creëer je karakter</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 text-center">
            <CardHeader>
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Stap 4</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Connect naar de server en begin je roleplay avontuur!</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Server Informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">Server IP:</h4>
                <code className="bg-background/50 px-3 py-2 rounded text-sm">connect cfx.re/join/abcd123</code>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Vereisten:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• FiveM client geïnstalleerd</li>
                  <li>• Discord account voor verificatie</li>
                  <li>• Werkende microfoon</li>
                  <li>• Minimaal 16 jaar oud</li>
                  <li>• Whitelist goedkeuring</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Discord Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Onze Discord server is het hart van onze community. Hier vind je:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Whitelist aanvragen en support
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Server updates en announcements
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Community chat en vrienden maken
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Event aankondigingen
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Roleplay tips en guides
                </li>
              </ul>
              <Button 
                variant="discord" 
                size="lg" 
                className="w-full mt-4"
                onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Join Discord Server
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-gradient-primary rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-primary-foreground mb-4">Begin vandaag nog!</h3>
            <p className="text-primary-foreground/90 mb-6">
              Sluit je aan bij honderden spelers die dagelijks geweldige verhalen beleven op Civitas RP. 
              Jouw avontuur wacht op je!
            </p>
            <Button 
              variant="secondary" 
              size="xl"
              onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Word lid van Civitas RP
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Join;