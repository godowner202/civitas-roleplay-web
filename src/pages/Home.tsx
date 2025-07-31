import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Partners />
      <Footer />
    </div>
  );
};

export default Home;