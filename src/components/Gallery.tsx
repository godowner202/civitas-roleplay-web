import { Card } from "@/components/ui/card";

const Gallery = () => {
  const screenshots = [
    {
      src: "/lovable-uploads/2d3ccd34-d1d7-40a0-8177-ea00e717cb95.png",
      alt: "Belgische Politie Auto - Civitas RP"
    },
    {
      src: "/lovable-uploads/48e4d31d-5f2a-43b0-860d-4328f6fc6530.png", 
      alt: "Politie Agent bij Politiewagen - Civitas RP"
    },
    {
      src: "/lovable-uploads/781c8a60-73ed-445f-aca5-be7165d435bf.png",
      alt: "Politie Department Kantoor - Civitas RP"
    },
    {
      src: "/lovable-uploads/4be33ebc-d5bc-4217-8c95-288abdb54bfb.png",
      alt: "Ziekenhuis & Medisch Centrum - Civitas RP"
    },
    {
      src: "/lovable-uploads/a0ae7c06-f4ac-4809-9409-b41a2cd92a61.png",
      alt: "Metro Station & Openbaar Vervoer - Civitas RP"
    },
    {
      src: "/lovable-uploads/87d4a968-8fa2-4320-ae50-4869c210ef65.png",
      alt: "Politie Helikopters boven de Stad - Civitas RP"
    },
    {
      src: "/lovable-uploads/350e4bd9-e87b-4965-9f7f-17f06e286cf2.png",
      alt: "Stadscentrum & Moderne Gebouwen - Civitas RP"
    },
    {
      src: "/lovable-uploads/2d45f384-7703-4a7d-b348-c5e36bc1b7b4.png",
      alt: "Los Santos Police Department - Civitas RP"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Server Screenshots
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bekijk hoe onze server eruitziet! Van realistische politie operaties tot het bruisende stadsleven - 
            ervaar de kwaliteit van Civitas RP.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {screenshots.map((screenshot, index) => (
            <Card key={index} className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Dit zijn echte screenshots van onze server. Sluit je aan en maak deel uit van deze geweldige community!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;