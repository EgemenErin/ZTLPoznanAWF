import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './Sections.css';
import finaleImage from '../assets/images/finał414.JPG';
import finaleImage2 from '../assets/images/finał425.JPG';
import bandImage from '../assets/images/finał168.JPG';
import costumesImage from '../assets/images/finał386.JPG';

const Sections = () => {
  const { t } = useLanguage();

  return (
    <>
      <section id="dancers" className="section-block reverse">
        <ScrollReveal className="section-image" variant="fadeRight">
           <img src={finaleImage2} alt={t.dancers.title} style={{objectFit: 'cover', height: '100%'}}/>
        </ScrollReveal>
        <ScrollReveal className="section-content" variant="fadeLeft">
          <h2 className="section-title">{t.dancers.title}</h2>
          <p>{t.dancers.paragraph1}</p>
          <p>{t.dancers.paragraph2}</p>
          <p>{t.dancers.paragraph3}</p>
        </ScrollReveal>
      </section>

      <section id="band" className="section-block">
        <ScrollReveal className="section-image" variant="fadeLeft">
           <img src={bandImage} alt={t.band.title} style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
        </ScrollReveal>
        <ScrollReveal className="section-content" variant="fadeRight">
          <h2 className="section-title">{t.band.title}</h2>
          <p>{t.band.description}</p>
          <ul className="instrument-list">
            <li>{t.band.instruments.violin}</li>
            <li>{t.band.instruments.contrabass}</li>
            <li>{t.band.instruments.clarinet}</li>
            <li>{t.band.instruments.trumpet}</li>
            <li>{t.band.instruments.accordion}</li>
            <li>{t.band.instruments.cymbals}</li>
            <li>{t.band.instruments.bass}</li>
          </ul>
        </ScrollReveal>
      </section>

      <section id="costumes" className="section-block reverse">
        <ScrollReveal className="section-image" variant="fadeRight">
           <img src={costumesImage} alt={t.costumes.title} style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
        </ScrollReveal>
        <ScrollReveal className="section-content" variant="fadeLeft">
          <h2 className="section-title">{t.costumes.title}</h2>
          <p>{t.costumes.paragraph1}</p>
          <p dangerouslySetInnerHTML={{ __html: t.costumes.paragraph2 }} />
          <p className="note">{t.costumes.paragraph3}</p>
        </ScrollReveal>
      </section>

      <section id="travels" className="travels py-5 text-center bg-light">
        <div className="container">
          <ScrollReveal variant="fadeUp">
            <h2 className="section-title">{t.travels.title}</h2>
            <p className="lead mb-2">{t.travels.subtitle}</p>
          </ScrollReveal>
          <div className="countries-grid">
            {t.travels.countries.map((country, index) => (
              <ScrollReveal key={country} variant="scaleUp" delay={index * 0.05} style={{ display: 'inline-block' }}>
                <span className="country-tag">{country}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Sections;
