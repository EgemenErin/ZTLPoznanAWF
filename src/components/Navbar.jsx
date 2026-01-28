import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import logo from '../assets/logo/ztllogo.png';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <div className="navbar-logo">
          <img src={logo} alt="ZTL Poznań AWF" />
        </div>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <a href="#about" onClick={() => setIsOpen(false)}>{t.nav.about}</a>
          <a href="#dancers" onClick={() => setIsOpen(false)}>{t.nav.dancers}</a>
          <a href="#band" onClick={() => setIsOpen(false)}>{t.nav.band}</a>
          <a href="#costumes" onClick={() => setIsOpen(false)}>{t.nav.costumes}</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>{t.nav.contact}</a>
        </div>

        <div className="navbar-icons">
          <LanguageSwitcher />
          <button className="icon-btn"><Search size={24} /></button>
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
