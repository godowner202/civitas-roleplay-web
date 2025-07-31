import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Star, Zap } from "lucide-react";
import PlayerCount from "./PlayerCount";

const About = () => {
  return (
    <section id="about" className="py-20 bg-darker-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Over Civitas RP
          </h2>
          <div className="mb-4">
            <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
              🚧 In Development
            </span>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Civitas RP is meer dan een server - het is een gemeenschap waar verhalen tot leven komen. 
            We gebruiken authentieke Belgische voertuigen en EUP van <strong className="text-primary">Belgium Modding Team</strong>, 
            wat zorgt voor een unieke en realistische Belgische roleplay ervaring.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Eerlijke Regels</h3>
              <p className="text-muted-foreground">Duidelijke regels en eerlijke moderatie voor iedereen</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vriendelijke Community</h3>
              <p className="text-muted-foreground">Welkomende spelers die samen geweldige verhalen creëren</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-neon-green/20 transition-colors">
                <Star className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Kwaliteit Scripts</h3>
              <p className="text-muted-foreground">Hoogwaardige custom scripts voor de beste ervaring</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Actieve Events</h3>
              <p className="text-muted-foreground">Regelmatige events en activiteiten voor alle spelers</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">Waarom Civitas RP?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Professioneel staff team dat 24/7 beschikbaar is
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Uitgebreide job systemen: politie, medics, advocaten en meer
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Realistic economy met banken, bedrijven en vastgoed
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Custom vehicles en clothing opties
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  Actieve roleplay scenarios en storylines
                </li>
              </ul>
            </div>
            <div className="bg-gradient-primary rounded-xl p-6 text-center">
              <PlayerCount />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;