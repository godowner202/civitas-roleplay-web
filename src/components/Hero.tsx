import { Button } from "@/components/ui/button";
import { Users, Crown, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woMTk2IDEwMCUgNTAlIC8gMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <img 
            src="/lovable-uploads/82dc1462-b853-481b-af5d-319601cd74b0.png" 
            alt="Civitas RP Logo" 
            className="h-32 w-auto mx-auto mb-6 drop-shadow-2xl"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Civitas RP
          </h1>
          
          <div className="mb-4">
            <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
              🚧 In Development
            </span>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            De beste Belgische FiveM Roleplay server. Authentieke Belgische voertuigen en uniformen door Belgium Modding Team. Beleef je dromen en maak deel uit van onze gemeenschap.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="neon" size="xl">
              <Users className="mr-2 h-5 w-5" />
              Sluit je bij ons aan
            </Button>
            <Button 
              variant="discord" 
              size="xl"
              onClick={() => window.open('https://discord.gg/CivitasRoleplay', '_blank')}
            >
              Discord Server
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:bg-card/70 transition-all duration-300">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Actieve Community</h3>
              <p className="text-muted-foreground">Meer dan 500+ actieve spelers</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:bg-card/70 transition-all duration-300">
              <Crown className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Premium Ervaring</h3>
              <p className="text-muted-foreground">Hoogwaardige roleplay en scripts</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:bg-card/70 transition-all duration-300">
              <MapPin className="h-8 w-8 text-neon-green mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Belgische Server</h3>
              <p className="text-muted-foreground">Lage latency en Nederlandse taal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;