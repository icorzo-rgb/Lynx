import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
    supabaseAnonKey !== 'tu-clave-publica-anon-key' &&
    supabaseUrl.startsWith('https://')
  );
};

// Cliente público con la clave anónima (con RLS habilitado en Supabase)
// NUNCA incluir la clave service_role en el código del cliente.
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Conversor de fila de base de datos PostgreSQL (snake_case) al modelo de objeto de LYNX (camelCase)
export function fromDbProvider(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    businessName: row.business_name || `${row.name} - ${row.category_name}`,
    avatarUrl: row.avatar_url || null,
    coverImageUrl: row.cover_image_url || null,
    categoryId: row.category_id,
    categoryName: row.category_name,
    customTrade: row.custom_trade || null,
    isMatriculado: Boolean(row.is_matriculado),
    hasInsurance: Boolean(row.has_insurance),
    licenseNumber: row.license_number || null,
    licenseDetails: row.license_details || null,
    isIdentityVerified: Boolean(row.is_identity_verified),
    isEmergency247: Boolean(row.is_emergency_247),
    isAvailableNow: Boolean(row.is_available_now),
    isUserCreated: Boolean(row.is_user_created),
    rating: row.rating !== null && row.rating !== undefined ? Number(row.rating) : null,
    totalReviews: Number(row.total_reviews) || 0,
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    locationName: row.location_name,
    coverageAreaDescription: row.coverage_area_description || `Cobertura activa en ${row.location_name}.`,
    distanceKm: row.distance_km !== null && row.distance_km !== undefined ? Number(row.distance_km) : 0.8,
    shortBio: row.short_bio || '',
    extendedDescription: row.extended_description || row.short_bio || '',
    servicesList: Array.isArray(row.services_list) ? row.services_list : [row.category_name, 'Reparaciones', 'Instalación', 'Presupuestos'],
    pricing: row.pricing && typeof row.pricing === 'object' ? row.pricing : {
      model: 'FREE_QUOTE',
      minVisitFeeArs: 0,
      displayText: 'Presupuesto sin cargo'
    },
    whatsappPhone: row.whatsapp_phone || '',
    responseTime: row.response_time || '~5 min',
    portfolio: Array.isArray(row.portfolio) ? row.portfolio : [],
    createdAt: row.created_at || null
  };
}

// Conversor del modelo de objeto de LYNX (camelCase) a fila de base de datos PostgreSQL (snake_case)
export function toDbProvider(p) {
  return {
    id: p.id,
    name: p.name,
    business_name: p.businessName || null,
    avatar_url: p.avatarUrl || null,
    cover_image_url: p.coverImageUrl || null,
    category_id: p.categoryId,
    category_name: p.categoryName,
    custom_trade: p.customTrade || null,
    is_matriculado: Boolean(p.isMatriculado),
    has_insurance: Boolean(p.hasInsurance),
    license_number: p.licenseNumber || null,
    license_details: p.licenseDetails || null,
    is_identity_verified: Boolean(p.isIdentityVerified),
    is_emergency_247: Boolean(p.isEmergency247),
    is_available_now: Boolean(p.isAvailableNow),
    is_user_created: Boolean(p.isUserCreated),
    rating: p.rating !== null && p.rating !== undefined ? Number(p.rating) : null,
    total_reviews: Number(p.totalReviews) || 0,
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    location_name: p.locationName,
    coverage_area_description: p.coverageAreaDescription || null,
    distance_km: p.distanceKm !== null && p.distanceKm !== undefined ? Number(p.distanceKm) : 0.8,
    short_bio: p.shortBio,
    extended_description: p.extendedDescription || null,
    services_list: Array.isArray(p.servicesList) ? p.servicesList : [],
    pricing: p.pricing || {},
    whatsapp_phone: p.whatsappPhone,
    response_time: p.responseTime || '~5 min',
    portfolio: Array.isArray(p.portfolio) ? p.portfolio : []
  };
}
