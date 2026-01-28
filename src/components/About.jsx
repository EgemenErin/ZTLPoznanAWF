import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="about py-5">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <ScrollReveal variant="fadeRight">
              <h2 className="section-title">{t.about.title}</h2>
              <p>{t.about.paragraph1}</p>
              <p dangerouslySetInnerHTML={{ __html: t.about.paragraph2 }} />
              <p>{t.about.paragraph3}</p>
            </ScrollReveal>
          </div>
          <div className="about-stats">
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="stat-item">
                <span className="stat-number">1982</span>
                <span className="stat-label">{t.about.statYear}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="stat-item">
                <span className="stat-number">60+</span>
                <span className="stat-label">{t.about.statMembers}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeUp" delay={0.6}>
              <div className="stat-item">
                <span className="stat-number">300</span>
                <span className="stat-label">{t.about.statCostumes}</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
