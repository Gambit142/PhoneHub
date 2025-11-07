import React from 'react';
import backgroundImage from '../assests/BackgroundImage1.jpg';

const HeroSection = ({ onShopNow }) => {
    return (
        <div className="hero relative grid place-items-center overflow-hidden min-h-[50vh] 
        md:min-h-[100vh] w-full"
            style={{ animation: 'clip-hero-anim 1.25s cubic-bezier(0.29, 0.8, 0.8, 0.98) forwards' }}>
            <div className="hero__bg absolute inset-0 z-0">
                <div className="relative w-full h-full">
                    <picture>
                        <img
                            src={backgroundImage}
                            loading="lazy"
                            alt="Hero Background"
                            className="w-full h-full object-cover object-[77%_50%] transform scale-125 animate-scaling-hero"
                        />
                    </picture>
                    <div className="absolute inset-0 bg-[(rgba(8, 0, 8, 0.4))] bg-blend-screen z-10"></div>
                </div>
            </div>
            <div className="hero__cnt relative z-20 text-center animate-fade-in 
            opacity-0 md:animate-[fade-in_0.75s_1.5s_linear_forwards]">
                <section className="bg-gradient-to-r text-white py-12 sm:py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">Latest Mobile Phones</h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
                            Discover the newest smartphones with cutting-edge technology
                        </p>
                        <button
                            onClick={onShopNow}
                            className="bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold 
                            hover:bg-gray-100 transition-colors transform hover:scale-105"
                        >
                            Shop Now
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

// Custom CSS for animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaling-hero-anim {
    from { transform: scale(1.25); }
    to { transform: scale(1.1); }
  }
  @keyframes clip-hero-anim {
    from { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
    to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); }
  }
  .animate-fade-in { animation: fade-in 0.75s linear forwards; }
  .animate-scaling-hero { animation: scaling-hero-anim 4s 0.25s cubic-bezier(0, 0.71, 0.4, 0.97) forwards; }
  .hero { animation: clip-hero-anim 1.25s cubic-bezier(0.29, 0.8, 0.8, 0.98) forwards; }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];

export default HeroSection;