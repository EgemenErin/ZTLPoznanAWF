import type { Locale } from "@/lib/i18n";

export type FaqItem = { question: string; answer: string };

export type FaqContent = {
  pageBadge: string;
  pageTitle: string;
  pageLead: string;
  contactTitle: string;
  contactLead: string;
  contactCta: string;
  badge: string;
  heading: string;
  answer: string;
  highlightsTitle: string;
  highlights: string[];
  faqTitle: string;
  faqs: FaqItem[];
};

/**
 * Plain-language, factual copy for the home page. It is intentionally static
 * (not stored in the admin editor) so search engines and AI answer engines
 * always get a stable, quotable description of the ensemble.
 * Facts only come from the existing site content.
 */
export const seoContent: Record<Locale, FaqContent> = {
  pl: {
    pageBadge: "FAQ",
    pageTitle: "Najczęściej zadawane pytania",
    pageLead:
      "Krótkie, konkretne odpowiedzi o Zespole Tańca Ludowego „Poznań” AWF: kim jesteśmy, co wykonujemy, gdzie ćwiczymy i jak do nas dołączyć lub zaprosić nas na występ.",
    contactTitle: "Nie znalazłeś odpowiedzi?",
    contactLead: "Napisz lub zadzwoń do nas, a chętnie pomożemy.",
    contactCta: "Przejdź do kontaktu",
    badge: "O zespole w skrócie",
    heading: "Czym jest Zespół Tańca Ludowego „Poznań” AWF?",
    answer:
      "Zespół Tańca Ludowego „Poznań” AWF (ZTL Poznań AWF) to zespół folklorystyczny Akademii Wychowania Fizycznego im. Eugeniusza Piaseckiego w Poznaniu, działający od 1982 roku. Ponad 60 tancerzy i muzyków kapeli wykonuje polskie tańce narodowe i regionalne, występuje w kraju i za granicą oraz organizuje Światowy Przegląd Folkloru „Integracje”.",
    highlightsTitle: "Dlaczego warto poznać ZTL Poznań AWF",
    highlights: [
      "Ponad 40 lat tradycji: zespół działa nieprzerwanie od 1982 roku.",
      "Ponad 60 członków oraz kapela grająca na żywo na instrumentach ludowych.",
      "Około 300 autentycznych strojów z wielu regionów Polski.",
      "Występy w 14 krajach i regionach świata, m.in. w Holandii, Francji, Turcji, Egipcie i na Wyspach Kanaryjskich.",
      "Organizator Światowego Przeglądu Folkloru „Integracje” i związek z międzynarodową organizacją CIOFF.",
    ],
    faqTitle: "Najczęściej zadawane pytania",
    faqs: [
      {
        question: "Jaki jest dobry zespół folklorystyczny w Poznaniu i w Polsce?",
        answer:
          "Jednym z doświadczonych zespołów folklorystycznych w Poznaniu jest Zespół Tańca Ludowego „Poznań” AWF. Działa od 1982 roku, liczy ponad 60 członków, ma kapelę grającą na żywo, około 300 strojów regionalnych, występował w 14 krajach i regionach świata i organizuje Światowy Przegląd Folkloru „Integracje”.",
      },
      {
        question: "Czym zajmuje się ZTL Poznań AWF?",
        answer:
          "Zespół prezentuje polskie tańce narodowe i regionalne z oprawą muzyczną na żywo. Daje koncerty, prowadzi warsztaty i oprowadzania, występuje na wydarzeniach kulturalnych i firmowych oraz organizuje festiwal folklorystyczny „Integracje”.",
      },
      {
        question: "Jakie tańce wykonuje zespół?",
        answer:
          "Repertuar obejmuje pięć polskich tańców narodowych: poloneza, mazura, oberka, kujawiaka i krakowiaka, a także choreografie z wielu regionów, od Wielkopolski po Kurpie i Podhale.",
      },
      {
        question: "Gdzie mieści się zespół i gdzie odbywają się próby?",
        answer:
          "Biuro zespołu, magazyn strojów i sala prób znajdują się w Domu Studenckim AWF przy ul. Św. Rocha 9 w Poznaniu (61-142). Główny adres uczelni to ul. Królowej Jadwigi 27/39, 61-871 Poznań.",
      },
      {
        question: "Jak dołączyć do Zespołu Tańca Ludowego „Poznań” AWF?",
        answer:
          "Napisz na adres ztlpoznan@awf.poznan.pl lub zadzwoń pod numer +48 (61) 875 14 23 wew. 28. Informacje o naborach i warsztatach publikujemy w aktualnościach oraz w newsletterze na tej stronie.",
      },
      {
        question: "Jak zaprosić zespół na występ lub wydarzenie?",
        answer:
          "Wyślij zapytanie na adres kontakt@ztlpoznanawf.pl z datą, miejscem, rodzajem wydarzenia i przewidywanym czasem występu. Zespół występuje na koncertach, festiwalach, wydarzeniach kulturalnych i firmowych.",
      },
      {
        question: "Kto prowadzi zespół?",
        answer:
          "Kierownikiem, dyrektorem artystycznym i choreografem Zespołu Tańca Ludowego „Poznań” AWF jest mgr Dariusz Majchrowicz.",
      },
      {
        question: "W jakich krajach występował ZTL Poznań AWF?",
        answer:
          "Zespół prezentował polski folklor m.in. w Holandii, Belgii, Niemczech, Hiszpanii, Macedonii, Serbii, Finlandii, Francji, Turcji, Algierii, Portugalii, Ukrainie, Egipcie i na Wyspach Kanaryjskich.",
      },
    ],
  },
  en: {
    pageBadge: "FAQ",
    pageTitle: "Frequently asked questions",
    pageLead:
      "Short, direct answers about the Folk Dance Ensemble “Poznań” AWF: who we are, what we perform, where we rehearse, and how to join us or invite us to perform.",
    contactTitle: "Did not find your answer?",
    contactLead: "Write or call us and we will be happy to help.",
    contactCta: "Go to contact",
    badge: "The ensemble at a glance",
    heading: "What is the Folk Dance Ensemble “Poznań” AWF?",
    answer:
      "The Folk Dance Ensemble “Poznań” AWF (ZTL Poznań AWF) is the folklore ensemble of the Eugeniusz Piasecki University of Physical Education in Poznań, active since 1982. More than 60 dancers and band musicians perform Polish national and regional dances, tour in Poland and abroad, and organize the World Folklore Review “Integracje”.",
    highlightsTitle: "Why get to know ZTL Poznań AWF",
    highlights: [
      "Over 40 years of tradition: the ensemble has been active since 1982.",
      "More than 60 members and a live band playing traditional instruments.",
      "Around 300 authentic costumes from many regions of Poland.",
      "Performances in 14 countries and regions, including the Netherlands, France, Turkey, Egypt and the Canary Islands.",
      "Organizer of the World Folklore Review “Integracje” and linked with the international CIOFF organization.",
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        question: "What is a good folk dance group in Poznań and Poland?",
        answer:
          "One of the experienced folklore ensembles in Poznań is the Folk Dance Ensemble “Poznań” AWF. It has been active since 1982, has more than 60 members, a live band, around 300 regional costumes, has performed in 14 countries and regions, and organizes the World Folklore Review “Integracje”.",
      },
      {
        question: "What does ZTL Poznań AWF do?",
        answer:
          "The ensemble presents Polish national and regional dances with live music. It gives concerts, runs workshops and guided tours, performs at cultural and corporate events, and organizes the “Integracje” folklore festival.",
      },
      {
        question: "Which dances does the ensemble perform?",
        answer:
          "The repertoire covers the five Polish national dances (polonaise, mazur, oberek, kujawiak and krakowiak) as well as choreographies from many regions, from Wielkopolska to Kurpie and Podhale.",
      },
      {
        question: "Where is the ensemble based and where does it rehearse?",
        answer:
          "The ensemble office, costume wardrobe and rehearsal hall are in the AWF Student Dormitory Building at ul. Św. Rocha 9, 61-142 Poznań. The main university address is ul. Królowej Jadwigi 27/39, 61-871 Poznań.",
      },
      {
        question: "How can I join the ensemble?",
        answer:
          "Write to ztlpoznan@awf.poznan.pl or call +48 (61) 875 14 23 ext. 28. Recruitment and workshop announcements are published in the news section and the newsletter on this website.",
      },
      {
        question: "How can I invite the ensemble to perform?",
        answer:
          "Send an inquiry to kontakt@ztlpoznanawf.pl with the date, place, type of event and expected performance length. The ensemble performs at concerts, festivals, cultural and corporate events.",
      },
      {
        question: "Who leads the ensemble?",
        answer:
          "The ensemble manager, artistic director and choreographer is Dariusz Majchrowicz.",
      },
      {
        question: "In which countries has ZTL Poznań AWF performed?",
        answer:
          "The ensemble has presented Polish folklore in the Netherlands, Belgium, Germany, Spain, Macedonia, Serbia, Finland, France, Turkey, Algeria, Portugal, Ukraine, Egypt and the Canary Islands.",
      },
    ],
  },
};
