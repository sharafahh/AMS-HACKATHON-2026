import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Stats from "../components/home/Stats";
import Tracks from "../components/home/Tracks";
import PrizePool from "../components/home/PrizePool";
import Timeline from "../components/home/Timeline";
import Facilities from "../components/home/Facilities";
import FAQ from "../components/home/FAQ";
import Contact from "../components/home/Contact";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-cyan-500 selection:text-black">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Landing Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. About Hackverse */}
        <About />

        {/* 3. Hackathon Statistics */}
        <Stats />

        {/* 4. Innovation Tracks (12 Cards) */}
        <Tracks />

        {/* 5. Prize Pool & Rewards */}
        <PrizePool />

        {/* 6. Event Timeline Roadmap */}
        <Timeline />

        {/* 7. Facilities & Infrastructure */}
        <Facilities />

        {/* 8. Frequently Asked Questions */}
        <FAQ />

        {/* 9. Contact & Map */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;