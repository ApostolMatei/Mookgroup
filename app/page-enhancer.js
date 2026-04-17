"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RESERVATION_URL =
  "https://www.sevenrooms.com/reservations/msteakhouse?venues=franziska,ivoryclub,monamiemaxi,msteakhouse,zenzakan";
const MENU_URL = "/msteakhouse/menu.pdf";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Feuerbachstra%C3%9Fe+11a%2C+60325+Frankfurt+am+Main";
const INVOICE_URL = "https://form.mook-group.de";
const INSTAGRAM_URL = "https://www.instagram.com/mook_group/";
const OFFICIAL_URL = "https://www.mook-group.de/msteakhouse/";
const MOOK_GROUP_URL = "https://www.mook-group.de/";
const LEGAL_URL = "https://www.mook-group.de/impressum/";
const PRIVACY_URL = "https://www.mook-group.de/datenschutz/";
const CAREER_URL = "mailto:info@mook-group.de";
const FRANKFURT_CENTER = [8.6521, 50.1154];

function setAccordionState(item, open) {
  const panel = item.querySelector(".accordion-panel");
  const button = item.querySelector(".accordion-header button");

  item.classList.toggle("is-open", open);

  if (panel) {
    panel.style.maxHeight = open ? `${panel.scrollHeight}px` : "0px";
  }

  if (button) {
    button.style.transform = open ? "rotateX(0deg)" : "rotateX(180deg)";
  }
}

function setText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function setHTML(node, value) {
  if (node) {
    node.innerHTML = value;
  }
}

function setImage(node, src, alt) {
  if (!node) {
    return;
  }

  node.src = src;
  node.alt = alt;
  node.removeAttribute("srcset");
  node.removeAttribute("sizes");
}

function setControlText(node, value) {
  if (!node) {
    return;
  }

  const wrappedLabel = node.querySelector(".text-wrap");

  if (wrappedLabel) {
    wrappedLabel.textContent = value;
    return;
  }

  const textNodes = Array.from(node.childNodes).filter(
    (child) => child.nodeType === Node.TEXT_NODE,
  );

  if (textNodes.length > 0) {
    textNodes[textNodes.length - 1].textContent = value;
  } else {
    node.append(document.createTextNode(value));
  }
}

function setLink(node, { href, text, target = "_self" }) {
  if (!node) {
    return;
  }

  node.href = href;
  node.target = target;
  node.rel = target === "_blank" ? "noopener noreferrer" : "";

  if (text) {
    setControlText(node, text);
  }
}

function ensureElement(parent, selector, tagName, className) {
  if (!parent) {
    return null;
  }

  let element = parent.querySelector(selector);

  if (!element) {
    element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    parent.appendChild(element);
  }

  return element;
}

function applyMenuItems(listNode, items) {
  if (!listNode) {
    return;
  }

  Array.from(listNode.querySelectorAll("li")).forEach((item, index) => {
    const link = item.querySelector("a");

    if (!link || !items[index]) {
      item.style.display = "none";
      return;
    }

    item.style.display = "";
    setLink(link, items[index]);
  });
}

function styleGoldButton(node) {
  if (!node) {
    return;
  }

  node.classList.remove("red");
  node.classList.add("gold");
  node.classList.remove("!text-white");
  node.style.removeProperty("background");
  node.style.removeProperty("border-color");
  node.style.removeProperty("color");

  const label = node.querySelector(".text-wrap");
  if (label) {
    label.style.removeProperty("color");
  }
}

function keepInstagramOnly(container) {
  if (!container) {
    return;
  }

  const links = Array.from(container.querySelectorAll("a"));
  const instagramLink = links.find((link) => {
    const imgAlt = link.querySelector("img")?.alt ?? "";

    return /instagram/i.test(link.href) || /instagram/i.test(imgAlt);
  });

  if (!instagramLink) {
    return;
  }

  links.forEach((link) => {
    if (link !== instagramLink) {
      link.remove();
    }
  });

  instagramLink.href = INSTAGRAM_URL;
  instagramLink.target = "_blank";
  instagramLink.rel = "nofollow noopener noreferrer";
}

function updateMenuList(section) {
  if (!section) {
    return;
  }

  setText(section.querySelector("h2"), "Speisekarte");

  const items = [
    { href: MENU_URL, label: "Aktuelle Speisekarte (PDF)", target: "_blank" },
    { href: RESERVATION_URL, label: "Tisch reservieren", target: "_blank" },
    { href: INVOICE_URL, label: "Rechnungsanfrage", target: "_blank" },
    { href: MAP_URL, label: "Anfahrt", target: "_blank" },
    { href: INSTAGRAM_URL, label: "Instagram", target: "_blank" },
    { href: OFFICIAL_URL, label: "Offizielle Restaurantseite", target: "_blank" },
  ];

  Array.from(section.querySelectorAll(".menu-list li")).forEach((item, index) => {
    if (!items[index]) {
      item.style.display = "none";
      return;
    }

    const link = item.querySelector("a");

    if (!link) {
      return;
    }

    link.href = items[index].href;
    link.target = items[index].target;
    link.rel = items[index].target === "_blank" ? "noopener noreferrer" : "";
    link.innerHTML = `${items[index].label} <span></span>`;
  });
}

function updateFaqItem(item, question, answerHtml) {
  if (!item) {
    return;
  }

  setText(item.querySelector(".accordion-header h4"), question);
  setHTML(item.querySelector(".relative.overflow-hidden.transition-all"), answerHtml);

  const button = item.querySelector(".accordion-header button");
  if (button) {
    button.setAttribute("aria-label", `Antwort anzeigen: ${question}`);
  }
}

function applyMsteakhouseContent(root) {
  root.classList.add("msteakhouse-theme");

  const headerBrandMarkup = [
    '<span class="msteakhouse-brand">',
    '<img src="/msteakhouse/logo.png" alt="M-Steakhouse Logo">',
    '<span class="msteakhouse-brand-copy">',
    "<span>M-Steakhouse</span>",
    "<small>Frankfurt</small>",
    "</span>",
    "</span>",
  ].join("");

  const footerBrandMarkup = [
    '<span class="msteakhouse-footer-brand">',
    '<img src="/msteakhouse/logo.png" alt="M-Steakhouse Logo">',
    "<span>M-Steakhouse</span>",
    "</span>",
  ].join("");

  const headerLogoLink = root.querySelector(".logo-container");
  if (headerLogoLink) {
    headerLogoLink.href = "#main-content";
    headerLogoLink.setAttribute("aria-label", "Zur Startseite");
    headerLogoLink.classList.add("msteakhouse-brand-link");
  }

  const mobileLogo = root.querySelector(".logo-container .logo");
  setHTML(mobileLogo, headerBrandMarkup);

  const scrollLogo = root.querySelector("#scroll-logo");
  setHTML(scrollLogo, headerBrandMarkup);
  scrollLogo?.classList.add("msteakhouse-desktop-brand");

  const header = root.querySelector("#main-nav");
  header?.classList.add("msteakhouse-site-header");

  const navWrapper = root.querySelector("#main-nav .nav-wrapper");
  navWrapper?.classList.add("msteakhouse-nav-wrapper");

  const mainNavigation = root.querySelector(".main-navigation");
  mainNavigation?.classList.add("msteakhouse-main-navigation");

  const headerCta = Array.from(navWrapper?.children ?? []).find(
    (child) =>
      child instanceof HTMLElement &&
      child !== mainNavigation &&
      child.querySelector?.(".openReserveModal"),
  );
  headerCta?.classList.add("msteakhouse-header-cta");

  const heroSection = root.querySelector("section.hero");
  if (heroSection) {
    heroSection.classList.add("msteakhouse-hero");
    heroSection.style.backgroundImage =
      "linear-gradient(180deg, rgba(11,7,5,0.48) 0%, rgba(11,7,5,0.76) 100%), url(/msteakhouse/interior-3.jpg)";
  }

  const heroContent = root.querySelector(".hero-content");
  heroContent?.classList.add("msteakhouse-hero-content");
  heroContent?.querySelector("picture")?.remove();

  const heroEyebrow = ensureElement(heroContent, ".hero-eyebrow", "p", "hero-eyebrow");
  const heroLead = ensureElement(heroContent, ".hero-lead", "p", "hero-lead");

  if (heroEyebrow) {
    heroEyebrow.textContent = "Frankfurt am Main";
  }
  setText(root.querySelector(".hero-content h1"), "M-Steakhouse");
  setText(root.querySelector(".hero-content h4"), "Klassisches Steakhouse");
  if (heroLead) {
    heroLead.textContent =
      "Prime Cuts, legendaere Atmosphaere und ein Abend im Stil der Mook Group.";
  }

  const heroHeading = heroContent?.querySelector("h1");
  if (heroHeading && heroEyebrow.nextElementSibling !== heroHeading) {
    heroContent.insertBefore(heroEyebrow, heroHeading);
  }

  const heroSubheading = heroContent?.querySelector("h4");
  if (heroSubheading && heroLead.previousElementSibling !== heroSubheading) {
    heroSubheading.insertAdjacentElement("afterend", heroLead);
  }

  let heroActions = heroContent?.querySelector(".hero-actions");
  if (!heroActions) {
    heroActions = heroContent?.querySelector(".flex.flex-col.md\\:flex-row.gap-8.items-center.mt-6");
  }
  if (!heroActions && heroContent) {
    heroActions = document.createElement("div");
    heroContent.appendChild(heroActions);
  }
  if (heroActions) {
    heroActions.className = "hero-actions";
    heroActions.innerHTML = [
      '<button class="btn btn-primary gold openReserveModal" type="button">',
      '<span class="relative z-40 text-wrap">Tisch reservieren</span>',
      "</button>",
      `<a class="btn btn-square dark hero-menu-link" href="${MENU_URL}" target="_blank" rel="noopener noreferrer">`,
      '<span class="relative z-40 text-wrap">Speisekarte ansehen</span>',
      "</a>",
    ].join("");
  }

  root.querySelectorAll(".openReserveModal").forEach((button) => {
    const label = button.querySelector(".text-wrap");

    if (label) {
      label.textContent = "Tisch reservieren";
    }

    styleGoldButton(button);
  });

  root.querySelectorAll(".btn.red, .reserve-now-button.red").forEach((button) => {
    styleGoldButton(button);
  });

  const mobileActionLinks = root.querySelectorAll("#mobileActionBar a");
  if (mobileActionLinks[0]) {
    mobileActionLinks[0].href = MAP_URL;
    mobileActionLinks[0].target = "_blank";
    mobileActionLinks[0].rel = "noopener noreferrer";
    setControlText(mobileActionLinks[0], "Anfahrt");
  }
  if (mobileActionLinks[1]) {
    mobileActionLinks[1].href = "#Menu-List";
    setControlText(mobileActionLinks[1], "Menü");
  }
  if (mobileActionLinks[2]) {
    mobileActionLinks[2].href = RESERVATION_URL;
    mobileActionLinks[2].target = "_blank";
    mobileActionLinks[2].rel = "noopener noreferrer";
    setControlText(mobileActionLinks[2], "Reservieren");
  }

  applyMenuItems(root.querySelector("#menu-main-menu-gb"), [
    { text: "Über uns", href: "#Experience-Section" },
    { text: "Menü", href: "#Menu-List" },
    { text: "Galerie", href: "#Happenings-Grid" },
    { text: "Karriere", href: "#Careers-Section" },
  ]);

  const mobileMenuItems = [
    { text: "Über uns", href: "#Experience-Section" },
    { text: "Speisekarte", href: "#Menu-List" },
    { text: "Galerie", href: "#Happenings-Grid" },
    { text: "Karriere", href: "#Careers-Section" },
    { text: "Kontakt", href: "#Location-Details" },
    { text: "Anfahrt", href: MAP_URL, target: "_blank" },
  ];

  applyMenuItems(root.querySelector("#menu-main-menu-burger-nav"), mobileMenuItems);
  applyMenuItems(root.querySelector("#menu-main-menu-burger-nav-1"), mobileMenuItems);

  const chatmeterSection = Array.from(root.querySelectorAll("section.content-heavy")).find(
    (section) => !section.querySelector("h4"),
  );
  chatmeterSection?.remove();

  const contentSections = Array.from(root.querySelectorAll("section.content-heavy"));
  const experienceSection = contentSections.find((section) =>
    /The Experience/i.test(section.textContent ?? ""),
  );

  if (experienceSection) {
    experienceSection.id = "Experience-Section";
    setText(experienceSection.querySelector("h4"), "Über uns");
    setText(
      experienceSection.querySelector("h2"),
      "Seit über zwanzig Jahren setzt M-Steakhouse Maßstäbe für Steakhouse-Kultur in Deutschland.",
    );
    setHTML(
      experienceSection.querySelector("p"),
      "Die Mook Group brachte Prime-Qualitäten, charakterstarke Cuts wie das Porterhouse und echtes Produktwissen nach Frankfurt. Bis heute steht M-Steakhouse für klassische Eleganz, kompromisslose Qualität und eine Atmosphäre, die aus einem Dinner einen Anlass macht.",
    );
  }

  const imageRows = root.querySelectorAll("section.image-text-row");
  const storySection = imageRows[0];
  const careersSection = imageRows[1];

  if (storySection) {
    storySection.id = "Story-Section";
    storySection.classList.add("msteakhouse-story-section");
    setText(
      storySection.querySelector("h2"),
      "Das Original unter den deutschen Upscale-Steakhäusern.",
    );
    setHTML(
      storySection.querySelector(".body-text"),
      [
        "<p>Als M-Steakhouse und Surf 'n Turf vor mehr als zwanzig Jahren eröffneten, galt vor allem mageres und günstiges Fleisch als Maßstab. Die Mook Group setzte bewusst auf Prime-Qualität, ikonische Steakhouse-Cuts und eine amerikanisch inspirierte Dining-Kultur.</p>",
        "<p>Dieses Selbstverständnis prägt das Haus bis heute: dunkles Holz, warmes Licht, souveräner Service und ein klares Bekenntnis zu Reifung, Herkunft und Produktqualität.</p>",
      ].join(""),
    );

    const storyButtons = storySection.querySelectorAll(".btn");
    setLink(storyButtons[0], {
      href: MAP_URL,
      text: "Anfahrt öffnen",
      target: "_blank",
    });
    setLink(storyButtons[1], {
      href: RESERVATION_URL,
      text: "Tisch reservieren",
      target: "_blank",
    });
    setImage(
      storySection.querySelector(".image img"),
      "/msteakhouse/interior-1.jpg",
      "Interior at M-Steakhouse",
    );
  }

  if (careersSection) {
    careersSection.id = "Careers-Section";
    careersSection.classList.add("msteakhouse-career-section");
    setText(careersSection.querySelector("h3"), "Karriere");
    setText(careersSection.querySelector("h2"), "Arbeiten bei der Mook Group");
    setHTML(
      careersSection.querySelector(".body-text"),
      [
        "<p>Die Mook Group ist ein inhabergeführtes Familienunternehmen und steht für Pioniergeist, Nachhaltigkeit und hohe ethische Standards. Wer hier arbeitet, arbeitet mit Anspruch, Haltung und Leidenschaft für echte Gastlichkeit.</p>",
        '<ul class="career-role-list"><li>Chef de Cuisine</li><li>Sous Chef</li><li>Chef de Partie</li><li>Restaurantleiter/-in</li><li>Barkeeper/-in</li><li>Sommelier / Sommelière</li><li>Chef de Rang</li><li>Commis de Rang</li></ul>',
        '<p>Bewerbungen bitte direkt an <a href="mailto:info@mook-group.de">info@mook-group.de</a>.</p>',
      ].join(""),
    );
    setLink(careersSection.querySelector(".btn"), {
      href: CAREER_URL,
      text: "Jetzt bewerben",
    });
    setImage(
      careersSection.querySelector(".image img"),
      "/msteakhouse/interior-3.jpg",
      "Bar und Interior im M-Steakhouse",
    );
  }

  const subNavItems = [
    { text: "Besuch", href: "#Location-Details" },
    { text: "Über uns", href: "#Experience-Section" },
    { text: "Menü", href: "#Menu-List" },
    { text: "Galerie", href: "#Happenings-Grid" },
    { text: "Karriere", href: "#Careers-Section" },
  ];

  Array.from(root.querySelectorAll("#sub-nav-anchor-links .nav-link")).forEach((item, index) => {
    const link = item.querySelector("a");
    const inner = item.querySelector(".inner");

    if (!link || !subNavItems[index]) {
      item.style.display = "none";
      return;
    }

    link.href = subNavItems[index].href;
    link.removeAttribute("target");
    link.setAttribute("aria-label", `Zum Abschnitt: ${subNavItems[index].text}`);
    setText(inner, subNavItems[index].text);
  });

  const detailCards = root.querySelectorAll("#Location-Details .link-card");
  if (detailCards[0]) {
    setLink(detailCards[0], {
      href: RESERVATION_URL,
      target: "_blank",
    });
    setText(detailCards[0].querySelector("p"), "Reservierung");
    setImage(
      detailCards[0].querySelector("img"),
      "/msteakhouse/interior-2.jpg",
      "M-Steakhouse dining room",
    );
  }

  if (detailCards[1]) {
    setLink(detailCards[1], {
      href: MENU_URL,
      target: "_blank",
    });
    setText(detailCards[1].querySelector("p"), "Speisekarte öffnen");
    setImage(
      detailCards[1].querySelector("img"),
      "/msteakhouse/menu-preview.jpg",
      "M-Steakhouse menu preview",
    );
  }

  const locationAccordionItems = root.querySelectorAll("#Location-Details .accordion-item");
  const locationAccordionContent = [
    {
      title: "Öffnungszeiten",
      html:
        '<p class="text-base mb-0">Montag bis Freitag: 12:00 - 15:00 Uhr<br>Montag bis Freitag: 18:00 - 00:00 Uhr<br>Samstag: 18:00 - 00:00 Uhr<br>Sonntag: geschlossen</p>',
    },
    {
      title: "Lunch",
      html:
        '<p class="text-base mb-0">Lunch servieren wir montags bis freitags von 12:00 bis 15:00 Uhr.</p>',
    },
    {
      title: "Dinner",
      html:
        '<p class="text-base mb-0">Dinner servieren wir montags bis samstags von 18:00 bis 00:00 Uhr.</p>',
    },
    {
      title: "Rechnungsanfrage",
      html: `<p class="text-base mb-0"><a href="${INVOICE_URL}" target="_blank" rel="noopener noreferrer">Zur offiziellen Rechnungsanfrage.</a></p>`,
    },
    {
      title: "Gutscheine",
      html:
        '<p class="text-base mb-0">Gutscheine sind in allen Restaurants der Mook Group gültig.</p>',
    },
  ];

  locationAccordionItems.forEach((item, index) => {
    if (!locationAccordionContent[index]) {
      item.style.display = "none";
      return;
    }

    setText(item.querySelector(".accordion-header h4"), locationAccordionContent[index].title);
    setHTML(
      item.querySelector(".relative.overflow-hidden.transition-all"),
      locationAccordionContent[index].html,
    );
  });

  const infoColumns = root.querySelectorAll("#Location-Details .grid.grid-cols-1.md\\:grid-cols-3.gap-4.md\\:gap-0.mt-12 > div");
  if (infoColumns[0]) {
    setText(infoColumns[0].querySelector("h4"), "Adresse");
    setHTML(infoColumns[0].querySelector("p"), "Feuerbachstraße 11a<br>60325 Frankfurt am Main");
    setLink(infoColumns[0].querySelector("a"), {
      href: MAP_URL,
      text: "Google Maps öffnen",
      target: "_blank",
    });
  }

  if (infoColumns[1]) {
    setText(infoColumns[1].querySelector("h4"), "Kontakt");
    setHTML(
      infoColumns[1].querySelector("p"),
      '<a href="tel:+496971034050">+49 69 71 03 40 50</a><br><a href="mailto:info@mook-group.de">info@mook-group.de</a>',
    );
  }

  if (infoColumns[2]) {
    setText(infoColumns[2].querySelector("h4"), "Instagram");
    keepInstagramOnly(infoColumns[2].querySelector(".social-links"));
  }

  updateMenuList(root.querySelector("#Menu-List"));

  const gallerySection = root.querySelector("#Happenings-Grid");
  if (gallerySection) {
    gallerySection.classList.add("msteakhouse-gallery-section");
    setText(gallerySection.querySelector("h2"), "Galerie");
    setLink(gallerySection.querySelector(".btn"), {
      href: OFFICIAL_URL,
      text: "Restaurantseite",
      target: "_blank",
    });

    const galleryItems = [
      {
        href: "/msteakhouse/interior-1.jpg",
        image: "/msteakhouse/interior-1.jpg",
        title: "Gastraum",
      },
      {
        href: "/msteakhouse/steak.jpg",
        image: "/msteakhouse/steak.jpg",
        title: "Signature Steak",
      },
      {
        href: "/msteakhouse/interior-2.jpg",
        image: "/msteakhouse/interior-2.jpg",
        title: "Abendstimmung",
      },
      {
        href: "/msteakhouse/interior-3.jpg",
        image: "/msteakhouse/interior-3.jpg",
        title: "Bar & Details",
        description:
          "Gedimmtes Licht, dunkles Holz und die klassische Atmosphäre des Originals.",
      },
    ];

    const galleryGrid = gallerySection.querySelector(".grid");
    galleryGrid?.classList.add("msteakhouse-gallery-grid");

    Array.from(gallerySection.querySelectorAll("[x-show]")).forEach((item, index) => {
      if (!galleryItems[index]) {
        item.style.display = "none";
        return;
      }

      const link = item.querySelector("a");
      const image = item.querySelector("img");
      const title = item.querySelector("h2");

      if (link) {
        link.href = galleryItems[index].href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      item.classList.add("msteakhouse-gallery-card");
      if (index === galleryItems.length - 1) {
        item.classList.add("is-featured");
      }

      setImage(image, galleryItems[index].image, galleryItems[index].title);
      setText(title, galleryItems[index].title);

      const body = item.querySelector(".happenings-card-body");
      if (body) {
        const note = ensureElement(body, ".gallery-note", "p", "gallery-note");
        note.textContent = galleryItems[index].description ?? "";
        note.hidden = !galleryItems[index].description;
      }
    });

    const loadMore = gallerySection.querySelector(".mt-6.flex.justify-center");
    if (loadMore) {
      loadMore.style.display = "none";
    }
  }

  const faqItems = root.querySelectorAll("#Faq-Section .accordion-item");
  const faqSection = root.querySelector("#Faq-Section");
  faqSection?.classList.add("msteakhouse-faq-section");

  const faqShell = faqSection?.querySelector(".container");
  faqShell?.classList.add("faq-shell");

  const faqLead = faqSection?.querySelector(".container > .flex");
  faqLead?.classList.add("faq-lead");
  setText(faqLead?.querySelector("h2"), "Haeufige Fragen");

  const faqIntro = ensureElement(faqLead, ".faq-intro", "p", "faq-intro");
  if (faqIntro) {
    faqIntro.textContent =
      "Reservierung, Oeffnungszeiten, Anfahrt und Karriere kompakt auf einen Blick.";
  }

  const faqAccordion = faqSection?.querySelector(".accordion-container");
  faqAccordion?.classList.add("faq-accordion-wide");
  faqAccordion?.classList.remove("lg:w-1/2", "mx-auto");

  const faqs = [
    {
      question: "Wo befindet sich das M-Steakhouse?",
      answer:
        `<p>Sie finden das M-Steakhouse in der <a href="${MAP_URL}" target="_blank" rel="noopener noreferrer">Feuerbachstrasse 11a, 60325 Frankfurt am Main</a>.</p>`,
    },
    {
      question: "Wie sind die Oeffnungszeiten?",
      answer:
        "<p>Montag bis Freitag: 12:00 - 15:00 Uhr und 18:00 - 00:00 Uhr</p><p>Samstag: 18:00 - 00:00 Uhr</p><p>Sonntag: geschlossen</p>",
    },
    {
      question: "Wie kann ich einen Tisch reservieren?",
      answer:
        `<p>Reservierungen laufen online ueber die offizielle Buchungsseite. <a href="${RESERVATION_URL}" target="_blank" rel="noopener noreferrer">Hier Tisch reservieren</a>.</p>`,
    },
    {
      question: "Wo finde ich die aktuelle Speisekarte?",
      answer:
        `<p>Die aktuelle M-Steakhouse Speisekarte steht als PDF bereit. <a href="${MENU_URL}" target="_blank" rel="noopener noreferrer">Speisekarte oeffnen</a>.</p>`,
    },
    {
      question: "Sind Gutscheine der Mook Group gueltig?",
      answer:
        "<p>Ja. Gutscheine sind in allen Restaurants der Mook Group gueltig.</p>",
    },
    {
      question: "Wie kann ich mich bewerben?",
      answer:
        `<p>Bewerbungen koennen direkt an <a href="${CAREER_URL}">info@mook-group.de</a> gesendet werden.</p>`,
    },
  ];

  faqItems.forEach((item, index) => {
    if (!faqs[index]) {
      item.style.display = "none";
      return;
    }

    updateFaqItem(item, faqs[index].question, faqs[index].answer);
  });

  const mapSection = root.querySelector(".location-map");
  if (mapSection) {
    mapSection.classList.add("msteakhouse-map-section");
    setHTML(
      mapSection.querySelector("h2"),
      'Frankfurt am Main <span class="text-gold-foil">Deutschland</span>',
    );
    mapSection.querySelector(".btn")?.remove();
  }

  const footerLogo = root.querySelector("footer .footer-logo a.logo");
  if (footerLogo) {
    footerLogo.href = "#main-content";
    footerLogo.setAttribute("aria-label", "Zur Startseite");
    setHTML(footerLogo, `<span class="sr-only">Startseite</span>${footerBrandMarkup}`);
  }

  keepInstagramOnly(root.querySelector("footer .social-links"));

  const footerEmbedWrapper = root.querySelector('footer iframe[src*="mixcloud"]')?.parentElement;
  if (footerEmbedWrapper) {
    footerEmbedWrapper.remove();
  }

  const footerItems = [
    { text: "Ueber uns", href: "#Experience-Section" },
    { text: "Kontakt", href: "#Location-Details" },
    { text: "Menue PDF", href: MENU_URL, target: "_blank" },
    { text: "Galerie", href: "#Happenings-Grid" },
    { text: "Karriere", href: "#Careers-Section" },
    { text: "Gutscheine", href: OFFICIAL_URL, target: "_blank" },
    { text: "Mook Group", href: MOOK_GROUP_URL, target: "_blank" },
  ];

  applyMenuItems(root.querySelector("#menu-footer-menu-gb"), footerItems);

  const copyrightLines = root.querySelectorAll("footer .copyright p");
  setText(copyrightLines[0], "Copyright 2026 by Mook Group. All Rights Reserved.");

  if (copyrightLines[1]) {
    copyrightLines[1].innerHTML =
      `<a href="${LEGAL_URL}" target="_blank" rel="noopener noreferrer" class="text-gray-300 text-sm">Impressum</a> | <a href="${PRIVACY_URL}" target="_blank" rel="noopener noreferrer" class="text-gray-300 text-sm">Datenschutz</a> | <a href="${MOOK_GROUP_URL}" target="_blank" rel="noopener noreferrer" class="text-gray-300 text-sm">Zur Mook Group</a>`;
  }
}

export default function PageEnhancer() {
  useEffect(() => {
    const root = document.getElementById("stk-clone");

    if (!root) {
      return undefined;
    }

    applyMsteakhouseContent(root);
    root.classList.add("is-enhanced");

    const cleanupFns = [];
    const media = gsap.matchMedia();

    root.querySelectorAll(".accordion-item").forEach((item) => {
      const panel = item.querySelector(".relative.overflow-hidden.transition-all");

      if (panel) {
        panel.classList.add("accordion-panel");
        panel.style.maxHeight = "0px";
      }
    });

    root.querySelectorAll(".accordion-container").forEach((container) => {
      const items = Array.from(container.querySelectorAll(".accordion-item")).filter(
        (item) => item.style.display !== "none",
      );

      items.forEach((item) => {
        const header = item.querySelector(".accordion-header");

        if (!header) {
          return;
        }

        const onClick = () => {
          const isOpen = item.classList.contains("is-open");

          items.forEach((entry) => setAccordionState(entry, false));
          setAccordionState(item, !isOpen);
          ScrollTrigger.refresh();
        };

        header.addEventListener("click", onClick);
        cleanupFns.push(() => header.removeEventListener("click", onClick));
      });

      if (items[0]) {
        setAccordionState(items[0], true);
      }
    });

    const reserveUrl = RESERVATION_URL;
    root.querySelectorAll(".openReserveModal").forEach((button) => {
      const onReserve = (event) => {
        event.preventDefault();
        window.open(reserveUrl, "_blank", "noopener,noreferrer");
      };

      button.addEventListener("click", onReserve);
      cleanupFns.push(() => button.removeEventListener("click", onReserve));
    });

    const mapContainer = root.querySelector('.location-map [id^="map-"]');
    if (mapContainer) {
      mapContainer.dataset.mapReady = "true";
      mapContainer.classList.add("msteakhouse-map-fallback");
      mapContainer.innerHTML = `<iframe class="map-fallback-embed" src="https://www.google.com/maps?q=Feuerbachstrasse%2011a%2C%2060325%20Frankfurt%20am%20Main&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" aria-label="Karte des M-Steakhouse in Frankfurt am Main"></iframe>`;
    }

    const header = root.querySelector("#main-nav");
    const mainNavigation = root.querySelector(".main-navigation");
    const popupNavigation = root.querySelector(".popup-navigation");
    const burgerButtons = Array.from(root.querySelectorAll("[data-burger-nav]"));
    const scrollLogo = root.querySelector("#scroll-logo");
    const mobileNavLinks = Array.from(root.querySelectorAll(".main-navigation a"));
    let navOpen = false;

    popupNavigation?.classList.remove("is-open");
    if (popupNavigation) {
      popupNavigation.style.display = "none";
    }

    const syncHeader = () => {
      if (!header) {
        return;
      }

      const isDesktop = window.innerWidth >= 1280;
      const scrolled = window.scrollY > 32;

      header.classList.toggle("is-scrolled", scrolled);

      if (scrollLogo) {
        scrollLogo.style.visibility = isDesktop ? "visible" : "hidden";
        scrollLogo.style.opacity = isDesktop ? "1" : "0";
      }

      if (!isDesktop && navOpen) {
        header.style.backgroundColor = "#0d0907";
      } else {
        header.style.backgroundColor = scrolled || !isDesktop
          ? "rgba(13, 9, 7, 0.92)"
          : "rgba(13, 9, 7, 0.38)";
      }
    };

    const setNav = (open) => {
      if (window.innerWidth >= 1280) {
        navOpen = false;
        mainNavigation?.classList.remove("is-open", "hidden");
        document.body.classList.remove("menu-open");
        syncHeader();
        return;
      }

      navOpen = open;

      header?.classList.toggle("is-open", open);
      burgerButtons.forEach((button) => button.classList.toggle("toggle", open));

      if (window.innerWidth < 1280 && mainNavigation) {
        mainNavigation.classList.toggle("is-open", open);
        mainNavigation.classList.toggle("hidden", !open);
      }

      document.body.classList.toggle("menu-open", open);
      syncHeader();
    };

    burgerButtons.forEach((button) => {
      const onToggle = () => setNav(!navOpen);
      button.addEventListener("click", onToggle);
      cleanupFns.push(() => button.removeEventListener("click", onToggle));
    });

    mobileNavLinks.forEach((link) => {
      const onClick = () => {
        if (window.innerWidth < 1280) {
          setNav(false);
        }
      };

      link.addEventListener("click", onClick);
      cleanupFns.push(() => link.removeEventListener("click", onClick));
    });

    const onScroll = () => syncHeader();
    const onResize = () => {
      if (window.innerWidth >= 1280 && mainNavigation) {
        mainNavigation.classList.remove("is-open");
        mainNavigation.classList.remove("hidden");
        navOpen = false;
      } else if (mainNavigation && !navOpen) {
        mainNavigation.classList.add("hidden");
      }

      if (popupNavigation) {
        popupNavigation.classList.remove("is-open");
        popupNavigation.style.display = "none";
      }

      root.querySelectorAll(".accordion-item.is-open").forEach((item) => {
        setAccordionState(item, true);
      });

      syncHeader();
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    cleanupFns.push(() => window.removeEventListener("scroll", onScroll));
    cleanupFns.push(() => window.removeEventListener("resize", onResize));

    onResize();

    media.add("(min-width: 0px)", () => {
      const heroItems = root.querySelectorAll(
        ".hero-eyebrow, .hero-content h1, .hero-content h4, .hero-lead, .hero-actions .btn, .hero-actions a",
      );

      gsap.set(heroItems, { autoAlpha: 1, y: 0 });

      gsap.utils
        .toArray(root.querySelectorAll(".fade, .reveal"))
        .forEach((element) => {
          ScrollTrigger.create({
            trigger: element,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                element,
                { autoAlpha: 0, y: 24 },
                {
                  autoAlpha: 1,
                  duration: 0.9,
                  ease: "power2.out",
                  y: 0,
                },
              );
            },
          });
        });
    });

    ScrollTrigger.refresh();

    return () => {
      root.classList.remove("is-enhanced");
      cleanupFns.forEach((fn) => fn());
      media.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
