import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bekijk hoe onze server eruitziet! Van realistische politie operaties tot het bruisende stadsleven - 
            ervaar de kwaliteit van Civitas RP.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {screenshots.map((screenshot, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer relative"
              onClick={() => setSelectedImage(screenshot.src)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Dit zijn echte screenshots van onze server. Sluit je aan en maak deel uit van deze geweldige community!
          </p>
        </div>
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage}
              alt="Full size screenshot"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;