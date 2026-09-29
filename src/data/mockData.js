export const CATEGORIES = [
  {
    id: 'todos',
    name: 'Todos los Rubros',
    slug: 'todos',
    icon: 'Layers',
    badge: null
  },
  {
    id: 'plomeria',
    name: 'Plomería',
    slug: 'plomeria',
    icon: 'Droplets',
    badge: 'Urgencias'
  },
  {
    id: 'albanileria',
    name: 'Albañilería',
    slug: 'albanileria',
    icon: 'Building2',
    badge: null
  },
  {
    id: 'electricidad',
    name: 'Electricidad',
    slug: 'electricidad',
    icon: 'Zap',
    badge: 'COPIME'
  },
  {
    id: 'carpinteria',
    name: 'Carpintería',
    slug: 'carpinteria',
    icon: 'Hammer',
    badge: null
  },
  {
    id: 'pintura',
    name: 'Pintura',
    slug: 'pintura',
    icon: 'Paintbrush',
    badge: null
  },
  {
    id: 'gasistas',
    name: 'Gasistas',
    slug: 'gasistas',
    icon: 'Flame',
    badge: 'ENARGAS'
  },
  {
    id: 'instalaciones',
    name: 'Instalaciones',
    slug: 'instalaciones',
    icon: 'Wrench',
    badge: null
  },
  {
    id: 'otros',
    name: 'Otros Oficios',
    slug: 'otros',
    icon: 'MoreHorizontal',
    badge: null
  }
];

export const ARGENTINA_LOCATIONS = [
  { id: 'caba-palermo', name: 'Palermo, CABA', lat: -34.5889, lon: -58.4306 },
  { id: 'caba-belgrano', name: 'Belgrano, CABA', lat: -34.5614, lon: -58.4564 },
  { id: 'caba-caballito', name: 'Caballito, CABA', lat: -34.6189, lon: -58.4436 },
  { id: 'caba-recoleta', name: 'Recoleta, CABA', lat: -34.5895, lon: -58.3974 },
  { id: 'caba-villaurquiza', name: 'Villa Urquiza, CABA', lat: -34.5739, lon: -58.4878 },
  { id: 'gba-sanisidro', name: 'San Isidro, GBA Norte', lat: -34.4717, lon: -58.5283 },
  { id: 'gba-vicentelopez', name: 'Vicente López, GBA Norte', lat: -34.5286, lon: -58.4797 },
  { id: 'gba-quilmes', name: 'Quilmes, GBA Sur', lat: -34.7203, lon: -58.2546 },
  { id: 'gba-ramosmejia', name: 'Ramos Mejía, GBA Oeste', lat: -34.6548, lon: -58.5637 },
  { id: 'cba-cordoba', name: 'Nueva Córdoba, Córdoba', lat: -31.4285, lon: -64.1887 },
  { id: 'sf-rosario', name: 'Centro, Rosario', lat: -32.9511, lon: -60.6664 },
  { id: 'mza-mendoza', name: 'Ciudad, Mendoza', lat: -32.8895, lon: -68.8458 },
  { id: 'rioja-capital', name: 'La Rioja, La Rioja', lat: -29.4131, lon: -66.8558 },
  { id: 'rioja-chilecito', name: 'Chilecito, La Rioja', lat: -29.1619, lon: -67.4974 },];

// Sin perfiles ficticios generados por IA: la plataforma arranca 100% limpia para perfiles reales.
export const INITIAL_PROVIDERS = [];

const LOCAL_STORAGE_PROVIDERS_KEY = 'lynx_real_workers_v1';
const LOCAL_STORAGE_FAVORITES_KEY = 'lynx_favorites_v3';

export const getStoredProviders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROVIDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filtrar exclusivamente perfiles reales creados por usuarios
        return parsed.filter(p => p.isUserCreated || p.id.startsWith('prov-custom-'));
      }
    }
  } catch (err) {
    console.warn('Error reading stored providers from localStorage:', err);
  }
  return [];
};

export const saveStoredProviders = (providersList) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROVIDERS_KEY, JSON.stringify(providersList));
  } catch (err) {
    console.warn('Error saving providers to localStorage:', err);
  }
};

export const getStoredFavorites = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading favorites from localStorage:', err);
  }
  return [];
};

export const saveStoredFavorites = (favoritesList) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favoritesList));
  } catch (err) {
    console.warn('Error saving favorites to localStorage:', err);
  }
};
