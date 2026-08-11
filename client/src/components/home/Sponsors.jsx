import { useState } from "react";
import infosysLogo from "../../assets/logos/infosys_springboard_nobg.png";
import thozhilLogo from "../../assets/logos/thozhil_nobg.png";
import oneyesLogo from "../../assets/logos/oneyes_nobg.png";
import gatewayLogo from "../../assets/logos/gateway_nobg.png";
import renderLogo from "../../assets/logos/render_nobg.png";
import xyzLogo from "../../assets/logos/xyz_nobg.png";
import codecrafterLogo from "../../assets/logos/codecrafters_nobg.png";

const tier1Sponsors = [
  {
    name: "Infosys Springboard",
    logo: infosysLogo,
    tag: "Platinum Sponsor",
  },
  {
    name: "Thözhil",
    logo: thozhilLogo,
    tag: "Global Internship Platform",
  },
  {
    name: "ONeyes Infotech Solutions",
    logo: oneyesLogo,
    tag: "Technology Partner",
  },
  {
    name: "Gateway Software Solutions",
    logo: gatewayLogo,
    tag: "IT & ITES Partner",
  },
];

const tier2Sponsors = [
  {
    name: "Render",
    logo: renderLogo,
    tag: "Hosting Partner",
    imgScale: "scale-[1.4] opacity-90",
    hoverScale: "group-hover:scale-[1.5]"
  },
  {
    name: "xyz.gen",
    logo: xyzLogo,
    tag: "Domain Partner",
    imgScale: "scale-100 grayscale opacity-60",
    hoverScale: "group-hover:scale-105"
  },
  {
    name: "CodeCrafters",
    logo: codecrafterLogo,
    tag: "Developer Tooling",
    imgScale: "scale-[1.2] opacity-80 grayscale",
    hoverScale: "group-hover:scale-[1.3]"
  },
];

const communitySponsors = [
  "Infosys Springboard", "Thözhil", "ONeyes Infotech Solutions", "Gateway Software Solutions", "Render", "xyz.gen", "CodeCrafters",
  "Infosys Springboard", "Thözhil", "ONeyes Infotech Solutions", "Gateway Software Solutions", "Render", "xyz.gen", "CodeCrafters"
];

function Sponsors() {
  return (
    <section id="sponsors" className="relative py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title & Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-black font-['Space_Grotesk'] text-white tracking-widest mb-4">
            MEET OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SPONSORS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 font-light text-sm md:text-base max-w-2xl mx-auto">
            Powering the next generation of innovators with world-class infrastructure and opportunities.
          </p>
        </div>

        {/* Tier 1: Platinum & Main Sponsors */}
        <div className="mb-10">
          <h3 className="text-sm md:text-base text-center text-gray-400 font-medium mb-8 uppercase tracking-[0.2em]">
            Platinum & Main Sponsors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {tier1Sponsors.map((sponsor, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-2xl bg-[#0b1120]/50 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 p-6 flex flex-row items-center justify-start h-32 md:h-40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] cursor-pointer gap-6"
              >
                <div className="w-1/3 h-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain filter grayscale opacity-75 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>
                <div className="w-2/3 flex flex-col items-start justify-center text-left">
                  <h4 className="text-lg md:text-xl font-bold font-['Space_Grotesk'] text-gray-200 group-hover:text-white transition-colors duration-300 leading-tight">
                    {sponsor.name}
                  </h4>
                  <span className="text-xs text-cyan-400/80 uppercase tracking-wider font-semibold mt-2">
                    {sponsor.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Infrastructure & Developer Tooling Partners */}
        <div className="mb-10">
          <h3 className="text-xs md:text-sm text-center text-gray-500 font-medium mb-6 uppercase tracking-[0.2em]">
            Infrastructure & Tooling Partners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tier2Sponsors.map((sponsor, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-xl bg-[#0b1120]/40 backdrop-blur-sm border border-white/5 hover:border-blue-500/40 p-5 flex flex-row items-center justify-start h-24 md:h-28 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] cursor-pointer gap-4"
              >
                <div className="w-1/3 h-full flex items-center justify-center overflow-visible">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className={`max-h-full max-w-full object-contain filter transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 ${sponsor.imgScale || 'grayscale opacity-60'} ${sponsor.hoverScale || 'group-hover:scale-105'}`}
                  />
                </div>
                <div className="w-2/3 flex flex-col items-start justify-center text-left">
                  <h4 className="text-sm md:text-base font-bold font-['Space_Grotesk'] text-gray-400 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                    {sponsor.name}
                  </h4>
                  <span className="text-[10px] text-blue-400/70 uppercase tracking-wider font-semibold mt-1.5">
                    {sponsor.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier 3: Infinite Marquee Carousel (Community Tiers) */}
      <div className="w-full overflow-hidden border-y border-white/[0.03] bg-white/[0.01] py-6 relative">
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex w-[200%] animate-infinite-scroll hover:[animation-play-state:paused] cursor-default items-center">
          {communitySponsors.map((name, idx) => (
            <div key={idx} className="flex-1 flex justify-center items-center px-4 md:px-8">
              <span className="text-gray-600 font-bold font-['Space_Grotesk'] text-sm md:text-lg uppercase tracking-[0.15em] whitespace-nowrap hover:text-gray-300 transition-colors duration-300">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sponsors;
