import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partners from "@/components/Partners";
import Rules from "@/components/Rules";
import Join from "@/components/Join";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Partners />
      <Rules />
      <Join />
      <Footer />
    </div>
  );
};

export default Index;
