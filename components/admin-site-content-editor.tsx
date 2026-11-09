"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Globe,
  LayoutTemplate,
  MapPin,
  Navigation,
  PhoneCall,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

import {
  resetLocaleSiteContent,
  updateLocaleSiteSection,
} from "@/app/admin/content/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";
import type {
  LocaleSiteContent,
  SiteContentMap,
  SiteSectionItem,
  SiteStat,
  TeamContactMember,
} from "@/lib/site-content";

export type EditableSectionKey =
  | "header"
  | "hero"
  | "about"
  | "sections"
  | "travels"
  | "location"
  | "kontakt"
  | "businessContact";

const SECTION_TABS: Array<{
  key: EditableSectionKey;
  labelPl: string;
  labelEn: string;
  icon: typeof Navigation;
}> = [
  { key: "header", labelPl: "Nagłówek (Header)", labelEn: "Header & Nav", icon: Navigation },
  { key: "hero", labelPl: "Ekran główny (Hero)", labelEn: "Main Hero", icon: Sparkles },
  { key: "about", labelPl: "O nas i statystyki", labelEn: "About & Stats", icon: Users },
  {
    key: "sections",
    labelPl: "Sekcje (Tancerze/Kapela/Stroje)",
    labelEn: "Repertoire Sections",
    icon: LayoutTemplate,
  },
  {
    key: "travels",
    labelPl: "Podróże i nagłówki",
    labelEn: "Travels & Headings",
    icon: Globe,
  },
  {
    key: "location",
    labelPl: "Siedziba i stopka",
    labelEn: "Location & Footer",
    icon: MapPin,
  },
  {
    key: "kontakt",
    labelPl: "Strona Kontakt",
    labelEn: "Kontakt Page",
    icon: PhoneCall,
  },
  {
    key: "businessContact",
    labelPl: "Kontakt dla firm",
    labelEn: "Business Contact",
    icon: PhoneCall,
  },
];

export function AdminSiteContentEditor({
  initialContent,
  initialLocale = "pl",
  focusedSection,
  onSaved,
}: {
  initialContent: SiteContentMap;
  initialLocale?: Locale;
  focusedSection?: EditableSectionKey;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [editLocale, setEditLocale] = useState<Locale>(initialLocale);
  const [activeTab, setActiveTab] = useState<EditableSectionKey>(focusedSection ?? "header");
  const [content, setContent] = useState<SiteContentMap>(initialContent);
  const [newCountry, setNewCountry] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    status: "idle" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const localeData = content[editLocale];

  function updateCurrentLocale(updater: (prev: LocaleSiteContent) => LocaleSiteContent) {
    setContent((prev) => ({
      ...prev,
      [editLocale]: updater(prev[editLocale]),
    }));
  }

  function handleSave() {
    setFeedback({ status: "idle", message: "" });
    startTransition(async () => {
      const result = await updateLocaleSiteSection(editLocale, content[editLocale]);
      if (result.content) {
        setContent(result.content);
      }
      setFeedback({
        status: result.status,
        message: result.message,
      });
      router.refresh();
      if (result.status === "success" && onSaved) {
        setTimeout(() => onSaved(), 400);
      }
    });
  }

  function handleResetLocale() {
    setFeedback({ status: "idle", message: "" });
    startTransition(async () => {
      const result = await resetLocaleSiteContent(editLocale);
      if (result.content) {
        setContent(result.content);
      }
      setFeedback({
        status: result.status,
        message:
          result.status === "success"
            ? `Restored default ${editLocale.toUpperCase()} content.`
            : result.message,
      });
      router.refresh();
    });
  }

  function updateStat(index: number, field: keyof SiteStat, value: string) {
    updateCurrentLocale((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
    }));
  }

  function addStat() {
    updateCurrentLocale((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: "100+", label: editLocale === "en" ? "New stat" : "Nowa statystyka" }],
    }));
  }

  function removeStat(index: number) {
    updateCurrentLocale((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  }

  function updateSectionItem(
    index: number,
    field: keyof SiteSectionItem,
    value: string,
  ) {
    updateCurrentLocale((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, i) =>
        i === index ? { ...sec, [field]: value } : sec,
      ),
    }));
  }

  function addSectionItem() {
    updateCurrentLocale((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `section-${Date.now()}`,
          image: "/images/final141.jpg",
          eyebrow: editLocale === "en" ? "New section" : "Nowa sekcja",
          title: editLocale === "en" ? "Section title" : "Tytuł sekcji",
          body: editLocale === "en" ? "Section description..." : "Opis sekcji...",
        },
      ],
    }));
  }

  function removeSectionItem(index: number) {
    updateCurrentLocale((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  function addCountry() {
    const trimmed = newCountry.trim();
    if (!trimmed) return;
    updateCurrentLocale((prev) => ({
      ...prev,
      countries: [...prev.countries, trimmed],
    }));
    setNewCountry("");
  }

  function removeCountry(index: number) {
    updateCurrentLocale((prev) => ({
      ...prev,
      countries: prev.countries.filter((_, i) => i !== index),
    }));
  }

  function updateTeamMember(
    index: number,
    field: keyof TeamContactMember,
    value: string,
  ) {
    updateCurrentLocale((prev) => ({
      ...prev,
      kontakt: {
        ...prev.kontakt,
        teamMembers: prev.kontakt.teamMembers.map((member, i) =>
          i === index ? { ...member, [field]: value } : member,
        ),
      },
    }));
  }

  function addTeamMember() {
    updateCurrentLocale((prev) => ({
      ...prev,
      kontakt: {
        ...prev.kontakt,
        teamMembers: [
          ...prev.kontakt.teamMembers,
          {
            id: `contact-${Date.now()}`,
            name: editLocale === "en" ? "Full Name" : "Imię i nazwisko",
            role: editLocale === "en" ? "Role / Position" : "Stanowisko / funkcja",
            email: "ztlpoznan@awf.poznan.pl",
            phone: "(61) 875 14 23",
            location: "Budynek Domu Studenckiego AWF, ul. Św. Rocha 9, 61-142 Poznań",
          },
        ],
      },
    }));
  }

  function removeTeamMember(index: number) {
    updateCurrentLocale((prev) => ({
      ...prev,
      kontakt: {
        ...prev.kontakt,
        teamMembers: prev.kontakt.teamMembers.filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <div id="content-editor" className="grid gap-6">
      {/* Top Bar: Language Toggle + Save */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-ink/10 bg-white/75 p-4 shadow-glass backdrop-blur md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
            Editing Language:
          </span>
          <button
            type="button"
            onClick={() => setEditLocale("pl")}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              editLocale === "pl"
                ? "bg-ink text-paper shadow-sm"
                : "border border-ink/15 bg-paper/70 text-ink/70 hover:border-ink/40"
            }`}
          >
            Polski (PL)
          </button>
          <button
            type="button"
            onClick={() => setEditLocale("en")}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              editLocale === "en"
                ? "bg-ink text-paper shadow-sm"
                : "border border-ink/15 bg-paper/70 text-ink/70 hover:border-ink/40"
            }`}
          >
            English (EN)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetLocale}
            disabled={isPending}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset {editLocale.toUpperCase()} defaults
          </Button>
          <Button
            type="button"
            variant="brass"
            size="default"
            onClick={handleSave}
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : `Save ${editLocale.toUpperCase()} changes`}
          </Button>
        </div>
      </div>

      {/* Section Selector Tabs (shown when not locked to a single focused section, or allow switching) */}
      {!focusedSection ? (
        <div className="flex flex-wrap gap-2">
          {SECTION_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  active
                    ? "bg-wine text-paper shadow-sm"
                    : "border border-ink/15 bg-white/65 text-ink/75 hover:border-brass/50 hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {editLocale === "en" ? tab.labelEn : tab.labelPl}
              </button>
            );
          })}
        </div>
      ) : null}

      {feedback.message ? (
        <div
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
            feedback.status === "error"
              ? "border-wine/30 bg-wine/10 text-wine"
              : "border-emerald-600/30 bg-emerald-50 text-emerald-800"
          }`}
        >
          <Check className="h-4 w-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      ) : null}

      {/* 1. HEADER & NAVIGATION */}
      {activeTab === "header" ? (
        <div className="grid gap-5 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>Header & Navigation ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Edit Header Text & Menu Links
            </h3>
            <p className="mt-1 text-sm text-ink/60">
              Change the brand title, subtitle, and navigation bar labels shown at the top of every page.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Header Brand Title
              </span>
              <Input
                value={localeData.header.brandTitle}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    header: { ...prev.header, brandTitle: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Header Subtitle
              </span>
              <Input
                value={localeData.header.brandSubtitle}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    header: { ...prev.header, brandSubtitle: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Nav Link: About (/#about)
              </span>
              <Input
                value={localeData.header.navAbout}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    header: { ...prev.header, navAbout: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Nav Link: Business Contact (/contact)
              </span>
              <Input
                value={localeData.header.navContactBusiness}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    header: { ...prev.header, navContactBusiness: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Nav Link: News (/news)
              </span>
              <Input
                value={localeData.header.navNews}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    header: { ...prev.header, navNews: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Nav Link: Kontakt Page (/kontakt)
              </span>
              <Input
                value={localeData.header.navContact}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    header: { ...prev.header, navContact: e.target.value },
                  }))
                }
              />
            </label>
          </div>
        </div>
      ) : null}

      {/* 2. HERO BANNER (MAIN SCREEN) */}
      {activeTab === "hero" ? (
        <div className="grid gap-5 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>Main Screen Hero ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Edit Main Screen Hero Banner
            </h3>
            <p className="mt-1 text-sm text-ink/60">
              Update the top hero badge, main headline, quote/lead paragraph, button labels, and hero image.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Top Badge Text
              </span>
              <Input
                value={localeData.hero.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, badge: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Background Image Path / URL
              </span>
              <Input
                value={localeData.hero.heroImage}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, heroImage: e.target.value },
                  }))
                }
                placeholder="/images/final414.jpg"
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Main Headline (H1)
            </span>
            <Input
              value={localeData.hero.title}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Lead Quote & Description
            </span>
            <Textarea
              rows={3}
              value={localeData.hero.lead}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, lead: e.target.value },
                }))
              }
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Primary Button Text
              </span>
              <Input
                value={localeData.hero.offerCta}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, offerCta: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Secondary Button Text
              </span>
              <Input
                value={localeData.hero.forumCta}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, forumCta: e.target.value },
                  }))
                }
              />
            </label>
          </div>
        </div>
      ) : null}

      {/* 3. ABOUT / HISTORY & STATS */}
      {activeTab === "about" ? (
        <div className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>About & Stats ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Edit History, Mission & Key Numbers
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Section Badge
              </span>
              <Input
                value={localeData.about.historyBadge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    about: { ...prev.about, historyBadge: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Section Heading
              </span>
              <Input
                value={localeData.about.historyTitle}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    about: { ...prev.about, historyTitle: e.target.value },
                  }))
                }
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              First Paragraph
            </span>
            <Textarea
              rows={3}
              value={localeData.about.history1}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  about: { ...prev.about, history1: e.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Second Paragraph
            </span>
            <Textarea
              rows={3}
              value={localeData.about.history2}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  about: { ...prev.about, history2: e.target.value },
                }))
              }
            />
          </label>

          <div className="border-t border-ink/10 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-serif text-2xl font-bold">Statistics Cards</h4>
              <Button type="button" variant="outline" size="sm" onClick={addStat}>
                <Plus className="h-4 w-4" /> Add Stat
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {localeData.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="grid gap-3 rounded-2xl border border-ink/10 bg-paper/75 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
                      Stat #{idx + 1}
                    </span>
                    {localeData.stats.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeStat(idx)}
                        className="text-ink/45 transition hover:text-wine"
                        title="Remove stat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  <Input
                    placeholder="Value (e.g. 1982)"
                    value={stat.value}
                    onChange={(e) => updateStat(idx, "value", e.target.value)}
                  />
                  <Input
                    placeholder="Label (e.g. Rok założenia)"
                    value={stat.label}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* 4. REPERTOIRE SECTIONS (DANCERS, BAND, COSTUMES) */}
      {activeTab === "sections" ? (
        <div className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge>Ensemble Sections ({editLocale.toUpperCase()})</Badge>
              <h3 className="mt-3 font-serif text-3xl font-bold">
                Dancers, Band & Costumes Cards
              </h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSectionItem}>
              <Plus className="h-4 w-4" /> Add Section Card
            </Button>
          </div>
          <div className="grid gap-6">
            {localeData.sections.map((section, idx) => (
              <div
                key={section.id || idx}
                className="grid gap-4 rounded-[1.75rem] border border-ink/10 bg-paper/75 p-5"
              >
                <div className="flex items-center justify-between">
                  <Badge>{section.eyebrow || `Section #${idx + 1}`}</Badge>
                  {localeData.sections.length > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSectionItem(idx)}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="grid gap-1.5 text-sm font-medium">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                      Eyebrow / Tag
                    </span>
                    <Input
                      value={section.eyebrow}
                      onChange={(e) => updateSectionItem(idx, "eyebrow", e.target.value)}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                      Title
                    </span>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSectionItem(idx, "title", e.target.value)}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                      Image Path / URL
                    </span>
                    <Input
                      value={section.image}
                      onChange={(e) => updateSectionItem(idx, "image", e.target.value)}
                    />
                  </label>
                </div>
                <label className="grid gap-1.5 text-sm font-medium">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                    Description
                  </span>
                  <Textarea
                    rows={3}
                    value={section.body}
                    onChange={(e) => updateSectionItem(idx, "body", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 5. TRAVELS & SECTION HEADINGS */}
      {activeTab === "travels" ? (
        <div className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>Travels & Section Headings ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Our Travels, Featured News & Events Headings
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Travels Badge
              </span>
              <Input
                value={localeData.travels.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    travels: { ...prev.travels, badge: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Travels Title
              </span>
              <Input
                value={localeData.travels.title}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    travels: { ...prev.travels, title: e.target.value },
                  }))
                }
              />
            </label>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper/75 p-5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Countries Visited
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {localeData.countries.map((country, idx) => (
                <span
                  key={`${country}-${idx}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-sm"
                >
                  {country}
                  <button
                    type="button"
                    onClick={() => removeCountry(idx)}
                    className="text-ink/40 hover:text-wine"
                    aria-label={`Remove ${country}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder={editLocale === "en" ? "Add country..." : "Dodaj kraj..."}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCountry();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCountry}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          <div className="grid gap-4 border-t border-ink/10 pt-5 md:grid-cols-2">
            <div className="grid gap-3 rounded-2xl border border-ink/10 bg-paper/75 p-4">
              <h4 className="font-serif text-xl font-bold">Featured News Section</h4>
              <Input
                placeholder="Badge"
                value={localeData.featuredNews.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    featuredNews: { ...prev.featuredNews, badge: e.target.value },
                  }))
                }
              />
              <Input
                placeholder="Title"
                value={localeData.featuredNews.title}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    featuredNews: { ...prev.featuredNews, title: e.target.value },
                  }))
                }
              />
              <Textarea
                rows={2}
                placeholder="Lead"
                value={localeData.featuredNews.lead}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    featuredNews: { ...prev.featuredNews, lead: e.target.value },
                  }))
                }
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-ink/10 bg-paper/75 p-4">
              <h4 className="font-serif text-xl font-bold">Upcoming Events Section</h4>
              <Input
                placeholder="Badge"
                value={localeData.eventsSection.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    eventsSection: { ...prev.eventsSection, badge: e.target.value },
                  }))
                }
              />
              <Input
                placeholder="Title"
                value={localeData.eventsSection.title}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    eventsSection: { ...prev.eventsSection, title: e.target.value },
                  }))
                }
              />
              <Textarea
                rows={2}
                placeholder="Lead"
                value={localeData.eventsSection.lead}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    eventsSection: { ...prev.eventsSection, lead: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* 6. LOCATION, NEWSLETTER & FOOTER */}
      {activeTab === "location" ? (
        <div className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>Location & Footer ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Main Screen Map Section & Footer Info
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Location Badge
              </span>
              <Input
                value={localeData.location.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    location: { ...prev.location, badge: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Location Heading
              </span>
              <Input
                value={localeData.location.title}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    location: { ...prev.location, title: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Organization Name
              </span>
              <Input
                value={localeData.location.organizationName}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    location: { ...prev.location, organizationName: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Street Address
              </span>
              <Input
                value={localeData.location.address}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value },
                  }))
                }
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Location Lead Text
            </span>
            <Textarea
              rows={2}
              value={localeData.location.lead}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  location: { ...prev.location, lead: e.target.value },
                }))
              }
            />
          </label>

          <div className="border-t border-ink/10 pt-5">
            <h4 className="mb-4 font-serif text-2xl font-bold">Footer Content</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                  Footer Team Name
                </span>
                <Input
                  value={localeData.footer.teamName}
                  onChange={(e) =>
                    updateCurrentLocale((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, teamName: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                  Artistic Director Line
                </span>
                <Input
                  value={localeData.footer.director}
                  onChange={(e) =>
                    updateCurrentLocale((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, director: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                  Address Line 1
                </span>
                <Input
                  value={localeData.footer.addressLine1}
                  onChange={(e) =>
                    updateCurrentLocale((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, addressLine1: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                  Address Line 2
                </span>
                <Input
                  value={localeData.footer.addressLine2}
                  onChange={(e) =>
                    updateCurrentLocale((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, addressLine2: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                  Address Line 3 (Postal & City)
                </span>
                <Input
                  value={localeData.footer.addressLine3}
                  onChange={(e) =>
                    updateCurrentLocale((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, addressLine3: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                  Copyright Text
                </span>
                <Input
                  value={localeData.footer.copyright}
                  onChange={(e) =>
                    updateCurrentLocale((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, copyright: e.target.value },
                    }))
                  }
                />
              </label>
            </div>
            <label className="mt-4 grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Footer Description
              </span>
              <Textarea
                rows={2}
                value={localeData.footer.description}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, description: e.target.value },
                  }))
                }
              />
            </label>
          </div>
        </div>
      ) : null}

      {/* 7. KONTAKT PAGE (/kontakt) */}
      {activeTab === "kontakt" ? (
        <div className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>Kontakt Page ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Edit Kontakt Page Details & Team Contacts
            </h3>
            <p className="mt-1 text-sm text-ink/60">
              Update emails, phone numbers, office and university addresses, and staff contact cards on /kontakt.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Page Badge
              </span>
              <Input
                value={localeData.kontakt.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, badge: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Page Title (H1)
              </span>
              <Input
                value={localeData.kontakt.title}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, title: e.target.value },
                  }))
                }
              />
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Intro / Lead Text
            </span>
            <Textarea
              rows={3}
              value={localeData.kontakt.lead}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  kontakt: { ...prev.kontakt, lead: e.target.value },
                }))
              }
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Primary Email (AWF ZTL)
              </span>
              <Input
                value={localeData.kontakt.primaryEmail}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, primaryEmail: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Secondary / General Email
              </span>
              <Input
                value={localeData.kontakt.secondaryEmail}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, secondaryEmail: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Phone Number
              </span>
              <Input
                value={localeData.kontakt.phone}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, phone: e.target.value },
                  }))
                }
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-3 rounded-2xl border border-ink/10 bg-paper/75 p-4">
              <h4 className="font-serif text-xl font-bold">ZTL Office & Rehearsal Venue</h4>
              <Input
                placeholder="Office Card Title"
                value={localeData.kontakt.officeTitle}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, officeTitle: e.target.value },
                  }))
                }
              />
              <Input
                placeholder="Building Name"
                value={localeData.kontakt.officeBuilding}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, officeBuilding: e.target.value },
                  }))
                }
              />
              <Input
                placeholder="Street & Postal Code"
                value={localeData.kontakt.officeAddress}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, officeAddress: e.target.value },
                  }))
                }
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-ink/10 bg-paper/75 p-4">
              <h4 className="font-serif text-xl font-bold">University Main Campus</h4>
              <Input
                placeholder="Campus Card Title"
                value={localeData.kontakt.campusTitle}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, campusTitle: e.target.value },
                  }))
                }
              />
              <Input
                placeholder="University Name"
                value={localeData.kontakt.campusName}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, campusName: e.target.value },
                  }))
                }
              />
              <Input
                placeholder="Campus Address"
                value={localeData.kontakt.campusAddress}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    kontakt: { ...prev.kontakt, campusAddress: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Organizational / Rehearsal Note
            </span>
            <Textarea
              rows={3}
              value={localeData.kontakt.rehearsalNote}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  kontakt: { ...prev.kontakt, rehearsalNote: e.target.value },
                }))
              }
            />
          </label>

          {/* Team Members Contacts */}
          <div className="border-t border-ink/10 pt-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-serif text-2xl font-bold">Team & Staff Contact Cards</h4>
                <p className="text-sm text-ink/60">
                  Add, edit, or remove contact cards for directors, coordinators, and staff.
                </p>
              </div>
              <Button type="button" variant="brass" size="sm" onClick={addTeamMember}>
                <Plus className="h-4 w-4" /> Add Contact Person
              </Button>
            </div>

            <div className="grid gap-4">
              {localeData.kontakt.teamMembers.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="grid gap-4 rounded-2xl border border-ink/10 bg-paper/75 p-5"
                >
                  <div className="flex items-center justify-between">
                    <Badge>{member.name || `Person #${idx + 1}`}</Badge>
                    {localeData.kontakt.teamMembers.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamMember(idx)}
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Full Name (e.g. mgr Dariusz Majchrowicz)"
                      value={member.name}
                      onChange={(e) => updateTeamMember(idx, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Role / Position"
                      value={member.role}
                      onChange={(e) => updateTeamMember(idx, "role", e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => updateTeamMember(idx, "email", e.target.value)}
                    />
                    <Input
                      placeholder="Phone"
                      value={member.phone}
                      onChange={(e) => updateTeamMember(idx, "phone", e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Office / Building Address"
                    value={member.location}
                    onChange={(e) => updateTeamMember(idx, "location", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* 8. BUSINESS CONTACT (/contact) */}
      {activeTab === "businessContact" ? (
        <div className="grid gap-5 rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-glass backdrop-blur md:p-8">
          <div>
            <Badge>Business Contact ({editLocale.toUpperCase()})</Badge>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Edit Business Inquiry Page (/contact)
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Badge
              </span>
              <Input
                value={localeData.businessContact.badge}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    businessContact: { ...prev.businessContact, badge: e.target.value },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Business Email
              </span>
              <Input
                value={localeData.businessContact.email}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    businessContact: { ...prev.businessContact, email: e.target.value },
                  }))
                }
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Main Title
            </span>
            <Input
              value={localeData.businessContact.title}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  businessContact: { ...prev.businessContact, title: e.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Lead Paragraph
            </span>
            <Textarea
              rows={3}
              value={localeData.businessContact.lead}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  businessContact: { ...prev.businessContact, lead: e.target.value },
                }))
              }
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Inquiry Box Heading
              </span>
              <Input
                value={localeData.businessContact.inquiryTitle}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    businessContact: {
                      ...prev.businessContact,
                      inquiryTitle: e.target.value,
                    },
                  }))
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
                Phone / Response Note
              </span>
              <Input
                value={localeData.businessContact.phoneNote}
                onChange={(e) =>
                  updateCurrentLocale((prev) => ({
                    ...prev,
                    businessContact: {
                      ...prev.businessContact,
                      phoneNote: e.target.value,
                    },
                  }))
                }
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
              Inquiry Box Instructions
            </span>
            <Textarea
              rows={2}
              value={localeData.businessContact.inquiryLead}
              onChange={(e) =>
                updateCurrentLocale((prev) => ({
                  ...prev,
                  businessContact: {
                    ...prev.businessContact,
                    inquiryLead: e.target.value,
                  },
                }))
              }
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
