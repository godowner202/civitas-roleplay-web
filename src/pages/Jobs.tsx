import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink,
  Construction,
  Building
} from "lucide-react";

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Jobs & Economie
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ontdek de diverse carrièremogelijkheden en het realistische economische systeem van Civitas RP. 
            Van overheidsdiensten tot ondernemerschap - jouw toekomst wacht!
          </p>
        </div>

        {/* Coming Soon Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6">
                  <Construction className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Jobs & Economie System in Ontwikkeling
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  We werken hard aan een compleet job- en economiesysteem voor Civitas RP. 
                  Binnenkort kunnen spelers kiezen uit diverse carrièremogelijkheden, 
                  van overheidsdiensten tot eigen bedrijven starten.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <Building className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">Overheidsdiensten</h3>
                    <p className="text-sm text-muted-foreground">Politie, Ambulance, Brandweer</p>
                  </div>
                  
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <Building className="w-8 h-8 text-accent mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">Burgerbanen</h3>
                    <p className="text-sm text-muted-foreground">Taxi, Monteur, Winkelier</p>
                  </div>
                  
                  <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                    <Building className="w-8 h-8 text-neon-green mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">Ondernemerschap</h3>
                    <p className="text-sm text-muted-foreground">Eigen bedrijven starten</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-base px-4 py-2">
                    🚧 Binnenkort beschikbaar!
                  </Badge>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
                      className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Volg Updates op Discord
                    </Button>
                    
                    <Button 
                      onClick={() => window.open('cfx.re/join/o8rdar', '_blank')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Join Server Nu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Preview Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Wat Je Kunt Verwachten</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Een voorproefje van het uitgebreide jobs & economie systeem dat eraan komt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Realistische Salarissen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verdien realistische lonen gebaseerd op je job en prestaties in de roleplay wereld.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Banking Systeem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compleet banksysteem met rekeningen, leningen en investeringsmogelijkheden.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground">Carrière Progressie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Klim op in je gekozen beroep en ontwikkel jezelf van beginneling tot expert.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;