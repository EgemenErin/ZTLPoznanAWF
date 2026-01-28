import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './Hero.css';
import heroImage1 from '../assets/images/finał414.JPG';
import heroImage2 from '../assets/images/finał425.JPG';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [heroImage1, heroImage2];
  const { t } = useLanguage();

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div 
          className="hero-slider"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`ZTL Poznań AWF Performance ${index + 1}`} 
              className="hero-image"
            />
          ))}
        </div>
        <div className="hero-overlay"></div>
      </div>
      
      <button className="hero-nav-btn prev" onClick={prevImage} aria-label="Previous image">
        <ChevronLeft size={48} />
      </button>

      <div className="hero-content container">
        <ScrollReveal variant="fadeUp" delay={0.2}>
          <h2 className="hero-subtitle">{t.hero.subtitle}</h2>
        </ScrollReveal>
        
        <ScrollReveal variant="fadeUp" delay={0.4}>
          <h1 className="hero-title">{t.hero.title} <br /> {t.hero.titleBreak}</h1>
        </ScrollReveal>
        
        <ScrollReveal variant="fadeUp" delay={0.6}>
          <p className="hero-quote">{t.hero.quote}</p>
        </ScrollReveal>
        
        <ScrollReveal variant="scaleUp" delay={0.8}>
          <div className="hero-cta">
            <button className="btn btn-primary">{t.hero.cta}</button>
          </div>
        </ScrollReveal>
      </div>

      <button className="hero-nav-btn next" onClick={nextImage} aria-label="Next image">
        <ChevronRight size={48} />
      </button>
    </section>
  );
};

export default Hero;
