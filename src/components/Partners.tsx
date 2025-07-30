import { Button } from "@/components/ui/button";
import { ExternalLink, Car, Shield } from "lucide-react";

const Partners = () => {
  return (
    <section id="partners" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Onze Partners
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We werken samen met de beste modding teams om jullie de meest authentieke Belgische ervaring te bieden.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Car className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3 text-primary">Belgium Modding Team</h3>
                <p className="text-muted-foreground mb-4">
                  Onze officiële partner voor authentieke Belgische voertuigen en EUP (Emergency Uniform Pack) voor politie en ambulancediensten. 
                  Dankzij hun expertise kunnen we een unieke en realistische Belgische roleplay ervaring aanbieden.
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                  <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                    <Car className="h-4 w-4 text-primary" />
                    <span className="text-sm">Belgische Voertuigen</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                    <Shield className="h-4 w-4 text-accent" />
                    <span className="text-sm">Politie & Ambulance EUP</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://discord.gg/rXhtybfVuc', '_blank')}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Hun Discord
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;