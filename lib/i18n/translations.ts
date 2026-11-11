export type Language = "es" | "en";

export const translations = {
  es: {
    // Nav
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_explore: "Explorar",
    nav_recommendations: "Recomendaciones",
    nav_ai_recommendations: "Recomendaciones con IA",
    nav_bookings: "Reservas",
    nav_about: "Acerca de",
    nav_colab: "Colab",
    nav_evidence: "Evidencias",
    nav_bi_panel: "Panel BI",
    nav_auditor: "Auditor",
    nav_my_business: "Mi Negocio",
    nav_documents: "Documentos",
    nav_catalog: "Catálogo",
    nav_login: "Login",
    nav_my_profile: "Mi Perfil",
    nav_favorites: "Favoritos",
    nav_account_data: "Datos de la Cuenta",
    nav_preferences: "Preferencias",
    nav_logout: "Cerrar sesión",

    // Header
    brand_title: "TURISMO SUSTENTABLE",

    // AI Recommendations
    ai_badge: "Recomendador con IA",
    ai_title: "¿Qué tipo de viaje sustentable buscas hoy?",
    ai_subtitle:
      "Cuéntanos qué te apasiona o con quién viajas. Nuestro asistente consulta en tiempo real las cooperativas y sellos certificados en la CDMX para recomendarte el plan ideal.",
    ai_placeholder:
      "Cuéntanos tu plan... Ej: 'Somos una pareja buscando una experiencia de naturaleza y gastronomía local con bajo impacto ambiental en el sur de la ciudad.'",
    ai_category: "Categoría:",
    ai_budget: "Presupuesto máx:",
    ai_btn_generate: "Generar Recomendación",
    ai_btn_consulting: "Consultando con Gemini...",
    ai_btn_login_to_query: "Iniciar sesión para consultar",
    ai_suggestions_title: "O prueba con una de estas sugerencias:",
    ai_auth_required_title: "Inicio de sesión requerido",
    ai_auth_required_desc:
      "Para interactuar con el recomendador con IA y acceder a planes personalizados, por favor ingresa con tu cuenta.",
    ai_auth_login_btn: "Iniciar sesión",
    ai_assistant_response: "Respuesta del Asistente",
    ai_verified_badge: "Sello Verificado",
    ai_price_per_person: "Precio por persona",
    ai_view_details: "Ver",

    // Dashboard
    dash_welcome: "Hola",
    dash_subtitle: "Bienvenido a tu panel de viajero consciente en la Ciudad de México.",
    dash_explore_btn: "Explorar experiencias",
    dash_my_account: "Mi cuenta",
    dash_upcoming_title: "Tu próxima aventura",
    dash_no_upcoming: "No tienes aventuras próximas programadas.",
    dash_explore_catalog: "Explorar catálogo sustentable",
    dash_confirmed_bookings: "Reservas Confirmadas",
    dash_saved_favorites: "Favoritos Guardados",
    dash_impact_title: "Tu impacto ambiental",
    dash_impact_desc:
      "Al reservar experiencias certificadas, apoyas a la economía local y evitas el greenwashing.",
  },
  en: {
    // Nav
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_explore: "Explore",
    nav_recommendations: "Recommendations",
    nav_ai_recommendations: "AI Recommendations",
    nav_bookings: "Bookings",
    nav_about: "About Us",
    nav_colab: "Collaborate",
    nav_evidence: "Evidence",
    nav_bi_panel: "BI Panel",
    nav_auditor: "Auditor",
    nav_my_business: "My Business",
    nav_documents: "Documents",
    nav_catalog: "Catalog",
    nav_login: "Log In",
    nav_my_profile: "My Profile",
    nav_favorites: "Favorites",
    nav_account_data: "Account Settings",
    nav_preferences: "Preferences",
    nav_logout: "Sign Out",

    // Header
    brand_title: "SUSTAINABLE TOURISM",

    // AI Recommendations
    ai_badge: "AI Recommender",
    ai_title: "What kind of sustainable trip are you looking for today?",
    ai_subtitle:
      "Tell us what you love or who you travel with. Our assistant checks real-time verified cooperatives and anti-greenwashing badges in Mexico City to craft your ideal plan.",
    ai_placeholder:
      "Tell us your plan... E.g.: 'We are a couple looking for a nature and local gastronomy experience with low environmental impact in the south of the city.'",
    ai_category: "Category:",
    ai_budget: "Max budget:",
    ai_btn_generate: "Generate Recommendation",
    ai_btn_consulting: "Checking with Gemini...",
    ai_btn_login_to_query: "Log in to query",
    ai_suggestions_title: "Or try one of these suggestions:",
    ai_auth_required_title: "Login Required",
    ai_auth_required_desc:
      "To interact with the AI recommender and access personalized itineraries, please log in with your account.",
    ai_auth_login_btn: "Log in",
    ai_assistant_response: "Assistant Response",
    ai_verified_badge: "Verified Badge",
    ai_price_per_person: "Price per person",
    ai_view_details: "View",

    // Dashboard
    dash_welcome: "Hello",
    dash_subtitle: "Welcome to your conscious traveler dashboard in Mexico City.",
    dash_explore_btn: "Explore experiences",
    dash_my_account: "My account",
    dash_upcoming_title: "Your upcoming adventure",
    dash_no_upcoming: "You have no upcoming adventures scheduled.",
    dash_explore_catalog: "Explore sustainable catalog",
    dash_confirmed_bookings: "Confirmed Bookings",
    dash_saved_favorites: "Saved Favorites",
    dash_impact_title: "Your environmental impact",
    dash_impact_desc:
      "By booking certified experiences, you support the local economy and avoid greenwashing.",
  },
};

export type TranslationKey = keyof typeof translations.es;

