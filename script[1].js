/*
  Configuration du site — remplacez ces valeurs avant une mise en ligne réelle.
  WHATSAPP_NUMBER : numéro international sans +, espaces ni tirets, ex. 212600000000.
  Tant qu'il reste vide, WhatsApp s'ouvre avec un message prérempli et laisse le visiteur choisir son destinataire.
*/
const SITE_CONFIG = {
  whatsappNumber: "",
  mapsQuery: "Martil, Maroc",
  instagramUrl: "https://www.instagram.com/",
  whatsappMessage: "Bonjour ! J’aimerais contacter Rive du Nord Café."
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Année dynamique du copyright.
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  // Liens configurables : numéro WhatsApp, requête Google Maps et compte Instagram.
  const encodedMessage = encodeURIComponent(SITE_CONFIG.whatsappMessage);
  const whatsappUrl = SITE_CONFIG.whatsappNumber
    ? `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl;
  });

  document.querySelectorAll("[data-maps]").forEach((link) => {
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONFIG.mapsQuery)}`;
  });

  document.querySelectorAll("[data-instagram]").forEach((link) => {
    link.href = SITE_CONFIG.instagramUrl;
  });

  // Navbar avec état au défilement.
  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menu mobile : ouverture, fermeture et fermeture avec Échap.
  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    navigation.classList.remove("is-open");
    header?.classList.remove("menu-open");
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
      navigation.classList.toggle("is-open", !isOpen);
      header?.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Apparition douce des sections. Sans IntersectionObserver, le contenu reste visible.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});