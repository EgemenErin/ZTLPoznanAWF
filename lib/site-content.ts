import type { Locale } from "@/lib/i18n";

export type SiteStat = {
  value: string;
  label: string;
};

export type SiteSectionItem = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  body: string;
};

export type TeamContactMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
};

export type LocaleSiteContent = {
  header: {
    brandTitle: string;
    brandSubtitle: string;
    navAbout: string;
    navContactBusiness: string;
    navNews: string;
    navContact: string;
  };
  hero: {
    badge: string;
    title: string;
    lead: string;
    offerCta: string;
    forumCta: string;
    heroImage: string;
  };
  about: {
    historyBadge: string;
    historyTitle: string;
    history1: string;
    history2: string;
  };
  stats: SiteStat[];
  sections: SiteSectionItem[];
  featuredNews: {
    badge: string;
    title: string;
    lead: string;
    readPost: string;
  };
  eventsSection: {
    badge: string;
    title: string;
    lead: string;
    viewAllEvents: string;
  };
  travels: {
    badge: string;
    title: string;
  };
  countries: string[];
  newsletterHome: {
    badge: string;
    title: string;
    lead: string;
  };
  location: {
    badge: string;
    title: string;
    lead: string;
    organizationName: string;
    address: string;
    openMap: string;
  };
  footer: {
    teamName: string;
    description: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    director: string;
    copyright: string;
  };
  kontakt: {
    badge: string;
    title: string;
    lead: string;
    primaryEmail: string;
    secondaryEmail: string;
    phone: string;
    officeTitle: string;
    officeBuilding: string;
    officeAddress: string;
    campusTitle: string;
    campusName: string;
    campusAddress: string;
    rehearsalNote: string;
    teamBadge: string;
    teamTitle: string;
    teamMembers: TeamContactMember[];
  };
  businessContact: {
    badge: string;
    title: string;
    lead: string;
    inquiryTitle: string;
    inquiryLead: string;
    email: string;
    phoneNote: string;
  };
};

export type SiteContentMap = Record<Locale, LocaleSiteContent>;

export const defaultSiteContent: SiteContentMap = {
  pl: {
    header: {
      brandTitle: "ZTL Poznań AWF",
      brandSubtitle: "Folk Dance Ensemble",
      navAbout: "O nas",
      navContactBusiness: "Kontakt dla firm",
      navNews: "Aktualności",
      navContact: "Kontakt",
    },
    hero: {
      badge: "Akademia Wychowania Fizycznego",
      title: "Zespół Tańca Ludowego “Poznań”",
      lead: "“Bo my tylko w tańcu jesteśmy naprawdę sobą.” Odkryj występy, warsztaty, oprowadzania i społeczność zbudowaną wokół polskiego folkloru.",
      offerCta: "Napisz do nas",
      forumCta: "Zobacz aktualności",
      heroImage: "/images/final414.jpg",
    },
    about: {
      historyBadge: "Historia i misja",
      historyTitle: "Cztery dekady tańca, muzyki i tradycji",
      history1:
        "Zespół Tańca Ludowego “Poznań” Akademii Wychowania Fizycznego został założony w 1982 roku. Od momentu powstania przez zespół przewinęły się setki entuzjastów folkloru.",
      history2:
        "Obecnie tworzą go studenci, młodzież pracująca i ucząca się, którzy pod okiem kierownika artystycznego i choreografa Dariusza Majchrowicza prezentują polskie tańce narodowe i regionalne.",
    },
    stats: [
      { value: "1982", label: "Rok założenia" },
      { value: "60+", label: "Członków" },
      { value: "300", label: "Strojów" },
    ],
    sections: [
      {
        id: "dancers",
        image: "/images/final425.jpg",
        eyebrow: "Tancerze",
        title: "Narodowe tańce i regionalny repertuar",
        body: "Tancerze prezentują poloneza, mazura, oberka, kujawiaka i krakowiaka oraz choreografie z kilkunastu regionów Polski, od Wielkopolski po Kurpie i Podhale.",
      },
      {
        id: "band",
        image: "/images/final168.jpg",
        eyebrow: "Kapela",
        title: "Żywa muzyka tradycyjna",
        body: "Integralną częścią zespołu jest kapela akompaniująca tancerzom na instrumentach tradycyjnych: skrzypcach, kontrabasie, klarnecie, trąbce, akordeonie i cymbałach.",
      },
      {
        id: "costumes",
        image: "/images/final386.jpg",
        eyebrow: "Stroje",
        title: "Autentyczne kostiumy z polskich regionów",
        body: "Zespół posiada około 300 kostiumów z najróżniejszych regionów Polski. To sceniczna opowieść o barwie, rzemiośle i pamięci przekazywanej przez pokolenia.",
      },
    ],
    featuredNews: {
      badge: "Aktualności społeczności",
      title: "Wyróżnione posty od zespołu",
      lead: "Najważniejsze komunikaty administracji: wydarzenia, nabory, warsztaty i informacje organizacyjne.",
      readPost: "Czytaj post",
    },
    eventsSection: {
      badge: "Wydarzenia",
      title: "Najbliższe wydarzenia",
      lead: "Wydarzenia opublikowane w panelu administracyjnym pojawiają się tutaj automatycznie.",
      viewAllEvents: "Zobacz kalendarz",
    },
    travels: {
      badge: "Nasze podróże",
      title: "Prezentowaliśmy folklor na scenach całego świata",
    },
    countries: [
      "Holandia",
      "Belgia",
      "Niemcy",
      "Hiszpania",
      "Macedonia",
      "Serbia",
      "Finlandia",
      "Francja",
      "Turcja",
      "Algieria",
      "Portugalia",
      "Ukraina",
      "Egipt",
      "Wyspy Kanaryjskie",
    ],
    newsletterHome: {
      badge: "Newsletter",
      title: "Bądź blisko wydarzeń",
      lead: "Zapisz się, aby otrzymywać informacje o koncertach, warsztatach, naborach i najważniejszych aktualnościach.",
    },
    location: {
      badge: "Gdzie nas znaleźć",
      title: "Nasza siedziba",
      lead: "Zespół działa przy Akademii Wychowania Fizycznego im. Eugeniusza Piaseckiego w Poznaniu.",
      organizationName: "AWF Poznań",
      address: "ul. Królowej Jadwigi 27/39, 61-871 Poznań",
      openMap: "Otwórz w mapach",
    },
    footer: {
      teamName: "Zespół Tańca Ludowego “Poznań” AWF",
      description:
        "Podtrzymujemy polski folklor, tradycje regionalne i sceniczny język tańca w Poznaniu oraz na świecie.",
      addressLine1: "AWF Poznań",
      addressLine2: "ul. Królowej Jadwigi 27/39",
      addressLine3: "61-871 Poznań",
      director: "Dyrektor Artystyczny: Dariusz Majchrowicz",
      copyright: "Wszelkie prawa zastrzeżone.",
    },
    kontakt: {
      badge: "Kontakt",
      title: "Skontaktuj się z nami",
      lead: "Masz pytania dotyczące działalności Zespołu Tańca Ludowego „Poznań” AWF, rekrutacji, prób lub występów? Poniżej znajdziesz bezpośrednie dane kontaktowe do kadry zespołu oraz adres naszej siedziby.",
      primaryEmail: "ztlpoznan@awf.poznan.pl",
      secondaryEmail: "kontakt@ztlpoznanawf.pl",
      phone: "+48 (61) 875 14 23 wew. 28",
      officeTitle: "Siedziba i biuro ZTL",
      officeBuilding: "Budynek Domu Studenckiego AWF",
      officeAddress: "ul. Św. Rocha 9, 61-142 Poznań",
      campusTitle: "Adres główny uczelni",
      campusName: "Akademia Wychowania Fizycznego im. Eugeniusza Piaseckiego w Poznaniu",
      campusAddress: "ul. Królowej Jadwigi 27/39, 61-871 Poznań",
      rehearsalNote:
        "Biuro zespołu, magazyn strojów oraz sala prób znajdują się w Budynku Domu Studenckiego Akademii Wychowania Fizycznego przy ul. Św. Rocha 9 w Poznaniu. Zespół jest również organizatorem Światowego Przeglądu Folkloru „Integracje”.",
      teamBadge: "Kadra i administracja",
      teamTitle: "Osoby kontaktowe",
      teamMembers: [
        {
          id: "dariusz-majchrowicz",
          name: "mgr Dariusz Majchrowicz",
          role: "Kierownik ZTL · Dyrektor Artystyczny i Choreograf",
          email: "ztlpoznan@awf.poznan.pl",
          phone: "(61) 875 14 23 wew. 28",
          location: "Budynek Domu Studenckiego AWF, ul. Św. Rocha 9, 61-142 Poznań",
        },
        {
          id: "katarzyna-golinska",
          name: "Katarzyna Golińska",
          role: "Starszy referent · Koordynator ds. organizacyjnych ZTL",
          email: "golinska@awf.poznan.pl",
          phone: "(61) 875 14 23",
          location: "Budynek Domu Studenckiego AWF, ul. Św. Rocha 9, 61-142 Poznań",
        },
        {
          id: "anna-startek",
          name: "Anna Startek",
          role: "Krawcowa / Garderobiana · Konserwatorka strojów",
          email: "magazynztl@awf.poznan.pl",
          phone: "(61) 875 14 23",
          location: "Budynek Domu Studenckiego AWF, ul. Św. Rocha 9, 61-142 Poznań",
        },
      ],
    },
    businessContact: {
      badge: "Kontakt dla firm",
      title: "Zaproś nas na wydarzenie",
      lead: "Napisz do nas w sprawie koncertów, warsztatów, wydarzeń kulturalnych, występów firmowych i współpracy.",
      inquiryTitle: "Wyślij zapytanie",
      inquiryLead:
        "Dodaj datę, miejsce, rodzaj wydarzenia, przewidywany czas występu oraz telefon kontaktowy.",
      email: "kontakt@ztlpoznanawf.pl",
      phoneNote:
        "Najszybszą odpowiedź uzyskasz, wysyłając e-mail z pełnymi szczegółami zapytania.",
    },
  },
  en: {
    header: {
      brandTitle: "ZTL Poznań AWF",
      brandSubtitle: "Folk Dance Ensemble",
      navAbout: "About",
      navContactBusiness: "Business contact",
      navNews: "News",
      navContact: "Contact",
    },
    hero: {
      badge: "University of Physical Education",
      title: "Folk Dance Ensemble “Poznań”",
      lead: "“Because only in dance are we truly ourselves.” Discover performances, workshops, guided tours, and a community built around Polish folklore.",
      offerCta: "Contact us",
      forumCta: "Read news",
      heroImage: "/images/final414.jpg",
    },
    about: {
      historyBadge: "History and mission",
      historyTitle: "Four decades of dance, music, and tradition",
      history1:
        "The Folk Dance Ensemble “Poznań” of the University of Physical Education was founded in 1982. Since then, hundreds of folklore enthusiasts have been part of the group.",
      history2:
        "Today it brings together students, young professionals, and learners who present Polish national and regional dances under the direction of choreographer Dariusz Majchrowicz.",
    },
    stats: [
      { value: "1982", label: "Founded" },
      { value: "60+", label: "Members" },
      { value: "300", label: "Costumes" },
    ],
    sections: [
      {
        id: "dancers",
        image: "/images/final425.jpg",
        eyebrow: "Dancers",
        title: "National dances and regional repertoire",
        body: "The dancers perform polonaise, mazur, oberek, kujawiak, and krakowiak, along with choreographies from many Polish regions, from Wielkopolska to Kurpie and Podhale.",
      },
      {
        id: "band",
        image: "/images/final168.jpg",
        eyebrow: "Band",
        title: "Live traditional music",
        body: "An integral part of the ensemble is the band accompanying dancers on traditional instruments: violin, double bass, clarinet, trumpet, accordion, and dulcimer.",
      },
      {
        id: "costumes",
        image: "/images/final386.jpg",
        eyebrow: "Costumes",
        title: "Authentic costumes from Polish regions",
        body: "The ensemble owns around 300 costumes from many regions of Poland. They tell a stage story of color, craft, and memory passed through generations.",
      },
    ],
    featuredNews: {
      badge: "Community updates",
      title: "Featured posts from the team",
      lead: "Key admin updates: events, recruitment, workshops, and organizational announcements.",
      readPost: "Read post",
    },
    eventsSection: {
      badge: "Events",
      title: "Upcoming events",
      lead: "Events published from the admin panel appear here automatically.",
      viewAllEvents: "View calendar",
    },
    travels: {
      badge: "Our travels",
      title: "We have presented folklore on stages around the world",
    },
    countries: [
      "Netherlands",
      "Belgium",
      "Germany",
      "Spain",
      "Macedonia",
      "Serbia",
      "Finland",
      "France",
      "Turkey",
      "Algeria",
      "Portugal",
      "Ukraine",
      "Egypt",
      "Canary Islands",
    ],
    newsletterHome: {
      badge: "Newsletter",
      title: "Stay close to our events",
      lead: "Subscribe for concerts, workshops, recruitment updates, and the most important ensemble news.",
    },
    location: {
      badge: "Where to find us",
      title: "Our home base",
      lead: "The ensemble operates at the Eugeniusz Piasecki University of Physical Education in Poznań.",
      organizationName: "AWF Poznań",
      address: "27/39 Królowej Jadwigi Street, 61-871 Poznań",
      openMap: "Open in maps",
    },
    footer: {
      teamName: "Folk Dance Ensemble “Poznań” AWF",
      description:
        "We preserve Polish folklore, regional traditions, and the stage language of dance in Poznań and abroad.",
      addressLine1: "AWF Poznań",
      addressLine2: "ul. Królowej Jadwigi 27/39",
      addressLine3: "61-871 Poznań",
      director: "Artistic Director: Dariusz Majchrowicz",
      copyright: "All rights reserved.",
    },
    kontakt: {
      badge: "Contact",
      title: "Get in touch with us",
      lead: "Have questions about the Folk Dance Ensemble “Poznań” AWF, recruitment, rehearsals, or performances? Below you will find direct contact information for our team and our office address.",
      primaryEmail: "ztlpoznan@awf.poznan.pl",
      secondaryEmail: "kontakt@ztlpoznanawf.pl",
      phone: "+48 (61) 875 14 23 ext. 28",
      officeTitle: "ZTL Office & Headquarters",
      officeBuilding: "AWF Student Dormitory Building",
      officeAddress: "ul. Św. Rocha 9, 61-142 Poznań",
      campusTitle: "Main University Address",
      campusName: "Eugeniusz Piasecki University of Physical Education in Poznań",
      campusAddress: "ul. Królowej Jadwigi 27/39, 61-871 Poznań",
      rehearsalNote:
        "The ensemble office, costume wardrobe, and rehearsal hall are located in the AWF Student Dormitory Building at 9 Św. Rocha Street in Poznań. The ensemble also organizes the World Folklore Review “Integracje”.",
      teamBadge: "Staff & Administration",
      teamTitle: "Key Contacts",
      teamMembers: [
        {
          id: "dariusz-majchrowicz",
          name: "mgr Dariusz Majchrowicz",
          role: "ZTL Manager · Artistic Director & Choreographer",
          email: "ztlpoznan@awf.poznan.pl",
          phone: "(61) 875 14 23 ext. 28",
          location: "AWF Student Dormitory Building, ul. Św. Rocha 9, 61-142 Poznań",
        },
        {
          id: "katarzyna-golinska",
          name: "Katarzyna Golińska",
          role: "Senior Specialist · Organizational Coordinator",
          email: "golinska@awf.poznan.pl",
          phone: "(61) 875 14 23",
          location: "AWF Student Dormitory Building, ul. Św. Rocha 9, 61-142 Poznań",
        },
        {
          id: "anna-startek",
          name: "Anna Startek",
          role: "Wardrobe & Costume Conservator",
          email: "magazynztl@awf.poznan.pl",
          phone: "(61) 875 14 23",
          location: "AWF Student Dormitory Building, ul. Św. Rocha 9, 61-142 Poznań",
        },
      ],
    },
    businessContact: {
      badge: "Business contact",
      title: "Invite us to your event",
      lead: "Write to us about concerts, workshops, cultural events, corporate performances, and cooperation opportunities.",
      inquiryTitle: "Send an inquiry",
      inquiryLead:
        "Include the date, location, type of event, expected duration, and contact phone number.",
      email: "kontakt@ztlpoznanawf.pl",
      phoneNote: "For best response, send an email with all business details.",
    },
  },
};

export const localizedSiteContent = defaultSiteContent;

function mergeLocaleContent(
  defaults: LocaleSiteContent,
  partial?: Partial<LocaleSiteContent> | null,
): LocaleSiteContent {
  if (!partial || typeof partial !== "object") {
    return defaults;
  }

  return {
    header: { ...defaults.header, ...(partial.header ?? {}) },
    hero: { ...defaults.hero, ...(partial.hero ?? {}) },
    about: { ...defaults.about, ...(partial.about ?? {}) },
    stats: Array.isArray(partial.stats) && partial.stats.length ? partial.stats : defaults.stats,
    sections:
      Array.isArray(partial.sections) && partial.sections.length
        ? partial.sections
        : defaults.sections,
    featuredNews: { ...defaults.featuredNews, ...(partial.featuredNews ?? {}) },
    eventsSection: { ...defaults.eventsSection, ...(partial.eventsSection ?? {}) },
    travels: { ...defaults.travels, ...(partial.travels ?? {}) },
    countries:
      Array.isArray(partial.countries) && partial.countries.length
        ? partial.countries
        : defaults.countries,
    newsletterHome: { ...defaults.newsletterHome, ...(partial.newsletterHome ?? {}) },
    location: { ...defaults.location, ...(partial.location ?? {}) },
    footer: { ...defaults.footer, ...(partial.footer ?? {}) },
    kontakt: {
      ...defaults.kontakt,
      ...(partial.kontakt ?? {}),
      teamMembers:
        Array.isArray(partial.kontakt?.teamMembers) && partial.kontakt.teamMembers.length
          ? partial.kontakt.teamMembers
          : defaults.kontakt.teamMembers,
    },
    businessContact: { ...defaults.businessContact, ...(partial.businessContact ?? {}) },
  };
}

export function mergeSiteContent(
  partial?: Partial<Record<Locale, Partial<LocaleSiteContent>>> | null,
): SiteContentMap {
  if (!partial || typeof partial !== "object") {
    return defaultSiteContent;
  }

  return {
    pl: mergeLocaleContent(defaultSiteContent.pl, partial.pl),
    en: mergeLocaleContent(defaultSiteContent.en, partial.en),
  };
}
