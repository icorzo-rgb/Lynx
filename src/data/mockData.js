import { 
  supabase, 
  isSupabaseConfigured, 
  fromDbProvider, 
  toDbProvider 
} from '../lib/supabaseClient';

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
const LOCAL_STORAGE_MY_PUBS_KEY = 'lynx_my_publication_ids_v1';

// Función para normalizar perfiles y limpiar reseñas
export const normalizeProviders = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .filter(p => p && (p.isUserCreated || (typeof p.id === 'string' && p.id.startsWith('prov-custom-'))))
    .map(p => {
      const realReviews = (p.reviews || []).filter(
        r => !r.id?.startsWith('rev-welcome-') && r.clientName !== 'Equipo de Validación Lynx'
      );
      const total = realReviews.length;
      const avg = total > 0 
        ? parseFloat((realReviews.reduce((acc, r) => acc + (Number(r.ratingOverall) || 0), 0) / total).toFixed(1))
        : null;
      return {
        ...p,
        reviews: realReviews,
        totalReviews: total,
        rating: avg
      };
    });
};

export const getStoredProviders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROVIDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return normalizeProviders(parsed);
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

// Sincronización con el Backend Compartido de Lynx (Supabase y Fallback Local)
export const fetchProvidersApi = async () => {
  // 1. Prioridad: Consulta a Supabase si está configurado (Producción en Vercel y Local)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(fromDbProvider);
        const normalized = normalizeProviders(mapped);
        saveStoredProviders(normalized);
        return normalized;
      } else if (error) {
        console.warn('[LYNX Supabase] Error al consultar perfiles:', error.message);
      }
    } catch (err) {
      console.warn('[LYNX Supabase] Fallo de red con Supabase:', err);
    }
  }

  // 2. Fallback de desarrollo local si se ejecuta con el servidor Vite local
  try {
    const res = await fetch('/api/providers', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = normalizeProviders(data);
        saveStoredProviders(normalized);
        return normalized;
      }
    }
  } catch (err) {
    // Entorno estático en Vercel o sin conexión
  }

  // 3. Fallback de contingencia offline (PWA): datos locales en el navegador
  return getStoredProviders();
};

export const saveProviderApi = async (provider) => {
  // 1. Guardar de forma persistente en Supabase si está configurado
  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = toDbProvider(provider);
      const { data, error } = await supabase
        .from('providers')
        .upsert(dbRow)
        .select()
        .single();

      if (!error && data) {
        return { success: true, provider: fromDbProvider(data) };
      } else if (error) {
        console.error('[LYNX Supabase] Error guardando trabajador:', error.message);
      }
    } catch (err) {
      console.warn('[LYNX Supabase] Fallo de red guardando en Supabase:', err);
    }
  }

  // 2. Fallback de desarrollo local (servidor Vite)
  try {
    const res = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(provider)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Entorno sin API local
  }

  return null;
};

export const deleteProviderApi = async (providerId) => {
  // 1. Eliminar en Supabase si está configurado
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', providerId);

      if (!error) {
        return { success: true, deletedId: providerId };
      } else {
        console.warn('[LYNX Supabase] Aviso al eliminar en Supabase:', error.message);
      }
    } catch (err) {
      console.warn('[LYNX Supabase] Fallo de red al eliminar en Supabase:', err);
    }
  }

  // 2. Fallback de desarrollo local
  try {
    const res = await fetch(`/api/providers/${encodeURIComponent(providerId)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Entorno sin API local
  }

  return null;
};

export const addReviewApi = async (providerId, review) => {
  // 1. Enviar calificación a Supabase mediante la función RPC segura
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('add_provider_review', {
        p_provider_id: providerId,
        p_review: review
      });

      if (!error && data) {
        return { success: true, ...data };
      }

      // Si la función RPC no estuviese creada en Supabase, aplicar actualización directa como respaldo
      const { data: currentP } = await supabase
        .from('providers')
        .select('reviews')
        .eq('id', providerId)
        .single();

      if (currentP) {
        const updatedReviews = [review, ...(currentP.reviews || [])];
        const total = updatedReviews.length;
        const sumRatings = updatedReviews.reduce((acc, r) => acc + (Number(r.ratingOverall) || 0), 0);
        const avg = total > 0 ? parseFloat((sumRatings / total).toFixed(1)) : null;

        const { error: updErr } = await supabase
          .from('providers')
          .update({
            reviews: updatedReviews,
            total_reviews: total,
            rating: avg
          })
          .eq('id', providerId);

        if (!updErr) {
          return { success: true, rating: avg, totalReviews: total };
        }
      }
    } catch (err) {
      console.warn('[LYNX Supabase] Error agregando reseña en Supabase:', err);
    }
  }

  // 2. Fallback de desarrollo local
  try {
    const res = await fetch(`/api/providers/${encodeURIComponent(providerId)}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Entorno sin API local
  }

  return null;
};

// Gestión local de IDs de publicaciones creadas en este navegador/dispositivo
export const getMyPublicationIds = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MY_PUBS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } else {
      // Migración suave: si el usuario ya tenía publicaciones creadas localmente antes de la persistencia compartida
      const localProviders = getStoredProviders();
      if (localProviders.length > 0) {
        const initialIds = localProviders.map(p => p.id);
        localStorage.setItem(LOCAL_STORAGE_MY_PUBS_KEY, JSON.stringify(initialIds));
        return initialIds;
      }
    }
  } catch (err) {
    console.warn('Error reading my publications from localStorage:', err);
  }
  return [];
};

export const addMyPublicationId = (id) => {
  try {
    const current = getMyPublicationIds();
    if (!current.includes(id)) {
      const updated = [id, ...current];
      localStorage.setItem(LOCAL_STORAGE_MY_PUBS_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (err) {
    console.warn('Error adding my publication ID:', err);
    return [];
  }
};

export const removeMyPublicationId = (id) => {
  try {
    const current = getMyPublicationIds();
    const updated = current.filter(item => item !== id);
    localStorage.setItem(LOCAL_STORAGE_MY_PUBS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Error removing my publication ID:', err);
    return [];
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

