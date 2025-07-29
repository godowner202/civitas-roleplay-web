import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BookOpen, Users2, MessageSquare } from "lucide-react";

const Rules = () => {
  return (
    <section id="rules" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Server Regels
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Voor een leuke en eerlijke ervaring voor iedereen volgen we duidelijke regels. 
            Lees ze goed door voordat je de server bezoekt.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <BookOpen className="h-6 w-6" />
                Algemene Regels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Respect naar alle spelers en staff leden</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Nederlands of Engels in de chat</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Geen cheats, exploits of hacks</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Minimumleeftijd van 16 jaar</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Goede microfoon kwaliteit verplicht</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-accent">
                <Users2 className="h-6 w-6" />
                Roleplay Regels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Blijf altijd in character (IC)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Geen FailRP - speel realistisch</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Respecteer /me en /do commands</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Geen Random Death Match (RDM)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Volg New Life Rule (NLR) na de dood</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-neon-green">
                <MessageSquare className="h-6 w-6" />
                Chat & Communicatie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Geen spam in chat of voice</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">OOC chat alleen voor belangrijke zaken</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Geen beledigingen of discriminatie</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Discord voor out-of-character gesprekken</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Waarschuwingen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">3 waarschuwingen = tijdelijke ban</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Ernstige overtredingen = directe ban</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Appeals mogelijk via Discord ticket</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">Staff beslissingen zijn definitief</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold mb-3 text-foreground">Volledige Regellijst</h3>
          <p className="text-muted-foreground mb-4">
            Voor de complete en gedetailleerde regels, bezoek onze Discord server waar je alle informatie kunt vinden.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Bekijk Volledige Regels op Discord
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rules;