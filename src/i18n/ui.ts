// Every string rendered by a shared component, in both languages.
// `es` is typed against `en`, so adding a key to one without the other fails
// the build instead of silently shipping English on the Spanish site.

const en = {
  htmlLang: "en",
  ogLocale: "en_US",
  site: {
    defaultTitle: "Bonet Plumbing LLC | Central Florida Plumber",
    defaultDescription:
      "Central Florida's trusted plumbing experts. Licensed & insured, same-day service. Call 407-734-3968.",
    homeTitle: "East Orlando & Avalon Park Plumber | Bonet Plumbing LLC",
    homeDescription:
      "Licensed plumber serving East Orlando, Avalon Park, Waterford Lakes and Oviedo. Water heaters, repiping, slab leaks and sewer lines. Same-day service. Call 407-734-3968.",
    orgDescription: "Licensed & insured plumbing services in Central Florida. Plumbers in Shining Armor.",
    ogImageAlt: "Bonet Plumbing LLC — Plumbers in Shining Armor",
    breadcrumbHome: "Home",
    breadcrumbAreas: "Service Areas",
  },
  // Language switcher. On English pages it reads "Hablamos español" and links
  // to the Spanish twin of the current page; on Spanish pages it offers English.
  badge: {
    text: "Hablamos español",
    aria: "Ver esta página en español",
    targetLocale: "es" as const,
  },
  nav: {
    brand: "Bonet Plumbing",
    logoAlt: "Bonet Plumbing LLC",
    callNow: "Call Now",
    callAria: "Call Bonet Plumbing at 407-734-3968",
  },
  hero: {
    h1: "East Orlando's Plumbers in Shining Armor",
    tagline: "Serving Avalon Park, Waterford Lakes, Alafaya & Oviedo",
    badges: ["Licensed & Insured", "Same-Day Rescue Service", "No Hidden Fees"],
    callNow: "Call Now",
    quote: "Request a Quote",
    ownerAlt: "Owner of Bonet Plumbing",
    ownerName: "Leo Bonet",
    ownerTitle: "Owner & Licensed Plumber",
    license: "License #CFC1434246",
  },
  services: {
    heading: "How We Defend Your Home",
    sub: "Professional solutions for every plumbing battle",
    learnMore: "Learn More About",
    items: [
      {
        title: "Whole-Home Repiping",
        description:
          "Replace aging galvanized or polybutylene pipes with modern PEX or copper — restored pressure, no more leaks, for decades.",
        icon: "pipe",
        href: "/repiping/",
      },
      {
        title: "Water Heaters & Tankless",
        description:
          "Replacement and tankless conversion (Rinnai, Navien, Rheem) for endless hot water and lower energy bills.",
        icon: "flame",
        href: "/water-heater-services/",
      },
      {
        title: "Slab Leak Repair",
        description:
          "Warm floor spots or a spiking water bill? We locate and reroute slab leaks before they wreck your foundation.",
        icon: "wrench",
        href: "/repiping/#slab-leak",
      },
      {
        title: "Sewer Line Replacement",
        description:
          "Trenchless replacement of collapsed, root-invaded, or bellied sewer lines — without tearing up your whole yard.",
        icon: "drain",
        href: "/repiping/#sewer-line",
      },
      {
        title: "Water Main Replacement",
        description:
          "Leaking or corroded service line from the meter to your home? We replace it, often trenchless, to restore full flow.",
        icon: "faucet",
        href: "/repiping/#water-main",
      },
      {
        title: "Gas Line Installation",
        description:
          "New gas lines and repairs for tankless heaters, generators, pool heaters, and outdoor kitchens — permitted and leak-tested.",
        icon: "flame",
        href: "/water-heater-services/#gas-line",
      },
    ],
  },
  trust: {
    heading: "Why Choose Bonet Plumbing",
    items: ["Licensed & Insured in FL", "Same-Day Service, Always Ready", "Upfront Pricing, No Surprises"],
  },
  reviews: {
    heading: "Trusted by Your Central Florida Neighbors",
    outOf: "out of 5 stars",
    on: "on",
    basedOn: (n: number) => `Based on ${n} reviews`,
    readFull: "Read full review",
    readAll: "Read all reviews on Google",
    note: "",
  },
  areas: {
    heading: "Proudly Protecting Central Florida Homes",
    callCta: "Need a plumber? Call",
    main: [
      { name: "Oviedo", href: "/oviedo-plumber/" },
      { name: "Winter Springs", href: "/winter-springs-plumber/" },
      { name: "East Orlando", href: "/east-orlando-plumber/" },
    ],
    more: [
      { name: "Lake Mary", href: "/lake-mary-plumber/" },
      { name: "Alafaya / UCF", href: "/alafaya-plumber/" },
      { name: "Avalon Park", href: "/avalon-park-plumber/" },
    ],
  },
  contact: {
    heading: "Ready to Call in the Cavalry?",
    bullets: [
      "Free estimates — no obligations",
      "Same-day rescue missions available",
      "Our knight's promise: satisfaction guaranteed",
    ],
    ownerAlt: "Leo Bonet, Owner of Bonet Plumbing",
    ownerName: "Leo Bonet",
    ownerTitle: "Owner & Licensed Plumber",
    license: "License #CFC1434246",
    preferCall: "Prefer to call?",
    callNow: "Call Now",
    formHeading: "Request a Quote",
    honeypot: "Don't fill this out:",
    name: "Name",
    namePlaceholder: "Your full name",
    phone: "Phone",
    phonePlaceholder: "(407) 555-1234",
    service: "Service Needed",
    selectService: "Select a service",
    services: [
      { value: "repiping", label: "Whole-Home Repiping" },
      { value: "water-heater", label: "Water Heater / Tankless" },
      { value: "slab-leak", label: "Slab Leak Repair" },
      { value: "sewer-line", label: "Sewer Line Replacement" },
      { value: "water-main", label: "Water Main Replacement" },
      { value: "gas-line", label: "Gas Line Installation" },
      { value: "water-pressure", label: "Water Pressure / PRV" },
      { value: "general-repair", label: "General Plumbing Repair" },
      { value: "other", label: "Other" },
    ],
    language: "Preferred language",
    languageEnglish: "English",
    languageSpanish: "Español",
    email: "Email",
    optional: "(optional)",
    emailPlaceholder: "your@email.com",
    message: "Anything else we should know?",
    messagePlaceholder: "Describe your plumbing issue...",
    submit: "Request a Quote",
    responseTime: "We typically respond within 1 hour",
    successPath: "/success/",
  },
  footer: {
    logoAlt: "Bonet Plumbing LLC",
    available: "Available 24/7",
    services: "Services",
    serviceLinks: [
      { label: "Whole-Home Repiping", href: "/repiping/" },
      { label: "Water Heaters & Tankless", href: "/water-heater-services/" },
      { label: "Slab Leak Repair", href: "/repiping/#slab-leak" },
      { label: "Sewer Line Replacement", href: "/repiping/#sewer-line" },
      { label: "Water Main Replacement", href: "/repiping/#water-main" },
      { label: "Gas Line Installation", href: "/water-heater-services/#gas-line" },
    ],
    areas: "Service Areas",
    company: "Company",
    quote: "Request a Quote",
    privacy: "Privacy Policy",
    licensed: "Licensed & Insured · License CFC1434246",
    motto: "Defending Central Florida Homes",
  },
  banner: {
    heading: "Get It Fixed Right — Starting Today",
    sub: "Free estimates and upfront pricing. Same-day service across Oviedo, Winter Springs & East Orlando.",
    callNow: "Call Now",
    quote: "Request a Quote",
  },
  bar: {
    region: "Quick contact",
    call: "Call",
    callSr: "Bonet Plumbing at 407-734-3968",
    text: "Text",
    textSr: "us a photo of the problem",
    quote: "Request a Quote",
  },
  sms: {
    label: "Text us a photo of the problem",
    body: "Hi Leo, here's a photo of my plumbing problem. Can you give me a quote?",
  },
  notFound: {
    title: "Page Not Found | Bonet Plumbing LLC",
    description:
      "The page you're looking for doesn't exist. Contact Bonet Plumbing for trusted plumbing services in Oviedo, Winter Springs & East Orlando.",
    heading: "Page Not Found",
    body: "Sorry, the page you're looking for doesn't exist or has been moved.",
    home: "Back to Home",
    call: "Call",
  },
  success: {
    title: "Request Received | Bonet Plumbing LLC",
    description:
      "Thank you for contacting Bonet Plumbing LLC. We received your request and will respond within 1 hour. Call 407-734-3968 for immediate help.",
    heading: "We Got Your Request!",
    body: "We'll be in touch shortly. Expect a call within 1 hour.",
    sooner: "Need help sooner?",
    call: "Call",
  },
};

export type UiStrings = typeof en;

const es: UiStrings = {
  htmlLang: "es",
  ogLocale: "es_US",
  site: {
    defaultTitle: "Bonet Plumbing LLC | Plomero en Florida Central",
    defaultDescription:
      "Los expertos en plomería de confianza en Florida Central. Con licencia y asegurados, servicio el mismo día. Llame al 407-734-3968.",
    homeTitle: "Plomero en East Orlando y Avalon Park | Bonet Plumbing LLC",
    homeDescription:
      "Plomero con licencia en East Orlando, Avalon Park, Waterford Lakes y Oviedo. Calentadores de agua, cambio de tuberías, fugas bajo la losa y líneas de cloaca. Servicio el mismo día. Llame al 407-734-3968.",
    orgDescription: "Servicios de plomería con licencia y seguro en Florida Central. Plomeros en Armadura Brillante.",
    ogImageAlt: "Bonet Plumbing LLC — Plomeros en Armadura Brillante",
    breadcrumbHome: "Inicio",
    breadcrumbAreas: "Áreas de servicio",
  },
  badge: {
    text: "English",
    aria: "View this page in English",
    targetLocale: "en" as const,
  },
  nav: {
    brand: "Bonet Plumbing",
    logoAlt: "Bonet Plumbing LLC",
    callNow: "Llame ahora",
    callAria: "Llame a Bonet Plumbing al 407-734-3968",
  },
  hero: {
    h1: "Los Plomeros en Armadura Brillante de East Orlando",
    tagline: "Servimos Avalon Park, Waterford Lakes, Alafaya y Oviedo",
    badges: ["Con licencia y asegurados", "Rescate el mismo día", "Sin cargos ocultos"],
    callNow: "Llame ahora",
    quote: "Solicitar cotización",
    ownerAlt: "Dueño de Bonet Plumbing",
    ownerName: "Leo Bonet",
    ownerTitle: "Dueño y plomero con licencia",
    license: "Licencia #CFC1434246",
  },
  services: {
    heading: "Cómo Defendemos Su Hogar",
    sub: "Soluciones profesionales para cada batalla de plomería",
    learnMore: "Más sobre",
    items: [
      {
        title: "Cambio Completo de Tuberías",
        description:
          "Reemplazamos tuberías viejas de acero galvanizado o polibutileno por PEX o cobre moderno: presión restaurada y sin fugas por décadas.",
        icon: "pipe",
        href: "/repiping/",
      },
      {
        title: "Calentadores de Agua y Sin Tanque",
        description:
          "Reemplazo y conversión a sistema sin tanque (Rinnai, Navien, Rheem) para agua caliente sin límite y facturas de energía más bajas.",
        icon: "flame",
        href: "/water-heater-services/",
      },
      {
        title: "Reparación de Fugas Bajo la Losa",
        description:
          "¿Puntos tibios en el piso o una factura de agua que se disparó? Localizamos y desviamos las fugas bajo la losa antes de que dañen sus cimientos.",
        icon: "wrench",
        href: "/repiping/#slab-leak",
      },
      {
        title: "Reemplazo de Línea de Cloaca",
        description:
          "Reemplazo sin zanja de líneas de cloaca colapsadas, invadidas por raíces o hundidas, sin destrozar todo su patio.",
        icon: "drain",
        href: "/repiping/#sewer-line",
      },
      {
        title: "Reemplazo de Línea Principal de Agua",
        description:
          "¿Fuga o corrosión en la línea que va del medidor a su casa? La reemplazamos, muchas veces sin zanja, para recuperar todo el flujo.",
        icon: "faucet",
        href: "/repiping/#water-main",
      },
      {
        title: "Instalación de Líneas de Gas",
        description:
          "Líneas de gas nuevas y reparaciones para calentadores sin tanque, generadores, calentadores de piscina y cocinas exteriores, con permisos y prueba de fugas.",
        icon: "flame",
        href: "/water-heater-services/#gas-line",
      },
    ],
  },
  trust: {
    heading: "Por qué elegir Bonet Plumbing",
    items: ["Con licencia y asegurados en FL", "Servicio el mismo día, siempre listos", "Precio por adelantado, sin sorpresas"],
  },
  reviews: {
    heading: "La Confianza de Sus Vecinos en Florida Central",
    outOf: "de 5 estrellas",
    on: "en",
    basedOn: (n: number) => `Basado en ${n} reseñas`,
    readFull: "Leer la reseña completa",
    readAll: "Ver todas las reseñas en Google",
    note: "Las reseñas se muestran en el idioma original en que fueron escritas.",
  },
  areas: {
    heading: "Protegiendo con Orgullo los Hogares de Florida Central",
    callCta: "¿Necesita un plomero? Llame al",
    main: [
      { name: "Oviedo", href: "/oviedo-plumber/" },
      { name: "Winter Springs", href: "/winter-springs-plumber/" },
      { name: "East Orlando", href: "/east-orlando-plumber/" },
    ],
    more: [
      { name: "Lake Mary", href: "/lake-mary-plumber/" },
      { name: "Alafaya / UCF", href: "/alafaya-plumber/" },
      { name: "Avalon Park", href: "/avalon-park-plumber/" },
    ],
  },
  contact: {
    heading: "¿Listo para Llamar a la Caballería?",
    bullets: [
      "Presupuestos gratis, sin compromiso",
      "Misiones de rescate el mismo día",
      "La promesa del caballero: satisfacción garantizada",
    ],
    ownerAlt: "Leo Bonet, dueño de Bonet Plumbing",
    ownerName: "Leo Bonet",
    ownerTitle: "Dueño y plomero con licencia",
    license: "Licencia #CFC1434246",
    preferCall: "¿Prefiere llamar?",
    callNow: "Llame ahora",
    formHeading: "Solicitar cotización",
    honeypot: "No llene este campo:",
    name: "Nombre",
    namePlaceholder: "Su nombre completo",
    phone: "Teléfono",
    phonePlaceholder: "(407) 555-1234",
    service: "Servicio que necesita",
    selectService: "Seleccione un servicio",
    services: [
      { value: "repiping", label: "Cambio completo de tuberías" },
      { value: "water-heater", label: "Calentador de agua / Sin tanque" },
      { value: "slab-leak", label: "Fuga bajo la losa" },
      { value: "sewer-line", label: "Reemplazo de línea de cloaca" },
      { value: "water-main", label: "Reemplazo de línea principal de agua" },
      { value: "gas-line", label: "Instalación de línea de gas" },
      { value: "water-pressure", label: "Presión de agua / Válvula reguladora (PRV)" },
      { value: "general-repair", label: "Reparación general de plomería" },
      { value: "other", label: "Otro" },
    ],
    language: "Idioma de preferencia",
    languageEnglish: "English",
    languageSpanish: "Español",
    email: "Correo electrónico",
    optional: "(opcional)",
    emailPlaceholder: "su@correo.com",
    message: "¿Algo más que debamos saber?",
    messagePlaceholder: "Describa su problema de plomería...",
    submit: "Solicitar cotización",
    responseTime: "Normalmente respondemos en menos de 1 hora",
    successPath: "/success/",
  },
  footer: {
    logoAlt: "Bonet Plumbing LLC",
    available: "Disponibles 24/7",
    services: "Servicios",
    serviceLinks: [
      { label: "Cambio completo de tuberías", href: "/repiping/" },
      { label: "Calentadores de agua y sin tanque", href: "/water-heater-services/" },
      { label: "Fugas bajo la losa", href: "/repiping/#slab-leak" },
      { label: "Línea de cloaca", href: "/repiping/#sewer-line" },
      { label: "Línea principal de agua", href: "/repiping/#water-main" },
      { label: "Líneas de gas", href: "/water-heater-services/#gas-line" },
    ],
    areas: "Áreas de servicio",
    company: "Empresa",
    quote: "Solicitar cotización",
    privacy: "Política de privacidad",
    licensed: "Con licencia y asegurados · Licencia CFC1434246",
    motto: "Defendiendo los hogares de Florida Central",
  },
  banner: {
    heading: "Arréglelo Bien, Desde Hoy",
    sub: "Presupuestos gratis y precios por adelantado. Servicio el mismo día en Oviedo, Winter Springs y East Orlando.",
    callNow: "Llame ahora",
    quote: "Solicitar cotización",
  },
  bar: {
    region: "Contacto rápido",
    call: "Llamar",
    callSr: "a Bonet Plumbing al 407-734-3968",
    text: "Texto",
    textSr: "envíenos una foto del problema",
    // Short form for the narrow bar; everywhere else says "Solicitar cotización".
    quote: "Cotizar",
  },
  sms: {
    label: "Envíenos una foto del problema por texto",
    body: "Hola Leo, aquí tiene una foto de mi problema de plomería. ¿Me puede dar una cotización?",
  },
  notFound: {
    title: "Página no encontrada | Bonet Plumbing LLC",
    description:
      "La página que busca no existe. Contacte a Bonet Plumbing para servicios de plomería de confianza en Oviedo, Winter Springs y East Orlando.",
    heading: "Página no encontrada",
    body: "Lo sentimos, la página que busca no existe o fue movida.",
    home: "Volver al inicio",
    call: "Llame al",
  },
  success: {
    title: "Solicitud recibida | Bonet Plumbing LLC",
    description:
      "Gracias por contactar a Bonet Plumbing LLC. Recibimos su solicitud y responderemos en menos de 1 hora. Llame al 407-734-3968 para ayuda inmediata.",
    heading: "¡Recibimos su solicitud!",
    body: "Nos comunicaremos con usted en breve. Espere una llamada en menos de 1 hora.",
    sooner: "¿Necesita ayuda más pronto?",
    call: "Llame al",
  },
};

export const ui = { en, es } as const;
