import './Footer.css';
import logo from '../assets/logo/ztllogo.png';
import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="ZTL Poznań AWF" />
            <p>{t.footer.teamName}</p>
          </div>
          
          <div className="footer-section">
            <h3>{t.footer.contactTitle}</h3>
            <p>AWF Poznań</p>
            <p>ul. Królowej Jadwigi 27/39</p>
            <p>61-871 Poznań</p>
            <br />
            <p><strong>{t.footer.artisticDirector}</strong></p>
            <p>Dariusz Majchrowicz</p>
          </div>

          <div className="footer-section">
            <h3>{t.footer.festivalTitle}</h3>
            <p>{t.footer.festivalDescription}</p>
            <a href="#" className="footer-link">{t.footer.learnMore} &rarr;</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
