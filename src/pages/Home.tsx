import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <Gallery />
      <Partners />
      <Footer />
    </Layout>
  );
};

export default Home;