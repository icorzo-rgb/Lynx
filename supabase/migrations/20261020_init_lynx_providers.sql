-- ==============================================================================
-- MIGRACIÓN DE PERSISTENCIA LYNX PARA SUPABASE
-- Archivo: supabase/migrations/20261020_init_lynx_providers.sql
-- Propósito: Almacenamiento persistente multi-usuario de perfiles reales de oficios
-- Compatible con Vercel y clientes web / PWA
-- ==============================================================================

-- 1. Crear tabla de perfiles de trabajadores (con todos los campos de LYNX)
create table if not exists public.providers (
  id text primary key,
  name text not null,
  business_name text,
  avatar_url text,
  cover_image_url text,
  category_id text not null,
  category_name text not null,
  custom_trade text,
  is_matriculado boolean default false,
  has_insurance boolean default true,
  license_number text,
  license_details text,
  is_identity_verified boolean default true,
  is_emergency_247 boolean default false,
  is_available_now boolean default true,
  is_user_created boolean default true,
  rating numeric(3,1),
  total_reviews integer default 0,
  reviews jsonb default '[]'::jsonb,
  location_name text not null,
  coverage_area_description text,
  distance_km numeric default 0.8,
  short_bio text not null,
  extended_description text,
  services_list jsonb default '[]'::jsonb,
  pricing jsonb default '{"model": "FREE_QUOTE", "minVisitFeeArs": 0, "displayText": "Presupuesto sin cargo"}'::jsonb,
  whatsapp_phone text not null,
  response_time text default '~5 min',
  portfolio jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Índices para acelerar búsquedas y filtros por rubro y ubicación
create index if not exists idx_providers_category on public.providers(category_id);
create index if not exists idx_providers_matriculado on public.providers(is_matriculado);
create index if not exists idx_providers_created_at on public.providers(created_at desc);

-- 3. Habilitar Seguridad a Nivel de Fila (RLS)
alter table public.providers enable row level security;

-- 4. POLÍTICAS DE ACCESO SEGURO (ROW LEVEL SECURITY):

-- 4.1. Lectura Pública: Todos los visitantes (anónimos o autenticados) pueden consultar los perfiles
drop policy if exists "lynx_public_read_providers" on public.providers;
create policy "lynx_public_read_providers" on public.providers
  for select
  using (true);

-- 4.2. Publicación de Perfiles: Cualquier usuario puede registrar y publicar su perfil
drop policy if exists "lynx_anon_insert_providers" on public.providers;
create policy "lynx_anon_insert_providers" on public.providers
  for insert
  with check (
    name is not null and 
    trim(name) <> '' and 
    whatsapp_phone is not null and 
    trim(whatsapp_phone) <> '' and 
    short_bio is not null and 
    trim(short_bio) <> ''
  );

-- 4.3. Autorización de Modificación y Eliminación:
-- NOTA IMPORTANTE DE SEGURIDAD:
-- Dado que LYNX aún no cuenta con autenticación de usuarios (Supabase Auth / login),
-- todas las peticiones desde el navegador operan bajo el rol público 'anon'.
-- NO se puede determinar con certeza criptográfica la titularidad de un registro 
-- utilizando solo un ID almacenado en localStorage del cliente (fácilmente falsificable).
-- Por ende, no se otorga permiso masivo de UPDATE ni DELETE a 'anon'.
-- Cuando se incorpore Supabase Auth (auth.uid()), la política será:
-- create policy "lynx_owner_delete" on public.providers for delete using (auth.uid() = user_id);

-- 5. Función Segura para Reseñas y Calificaciones (RPC):
-- Permite que los clientes califiquen a un profesional y dejen reseñas
-- SIN tener permiso de modificar el nombre, matrícula, teléfono ni datos del profesional.
create or replace function public.add_provider_review(
  p_provider_id text,
  p_review jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_provider record;
  v_reviews jsonb;
  v_total int;
  v_sum numeric;
  v_avg numeric(3,1);
  v_item jsonb;
begin
  select * into v_provider from public.providers where id = p_provider_id;
  if not found then
    raise exception 'Trabajador no encontrado';
  end if;

  -- Agregar la nueva reseña al inicio de la lista
  v_reviews := jsonb_build_array(p_review) || coalesce(v_provider.reviews, '[]'::jsonb);
  v_total := jsonb_array_length(v_reviews);
  
  -- Recalcular el promedio real de estrellas
  v_sum := 0;
  for v_item in select * from jsonb_array_elements(v_reviews) loop
    v_sum := v_sum + coalesce((v_item->>'ratingOverall')::numeric, 0);
  end loop;

  if v_total > 0 then
    v_avg := round((v_sum / v_total), 1);
  else
    v_avg := null;
  end if;

  -- Actualizar únicamente reseñas y promedios en la tabla
  update public.providers
  set 
    reviews = v_reviews,
    total_reviews = v_total,
    rating = v_avg
  where id = p_provider_id;

  return jsonb_build_object(
    'success', true,
    'provider_id', p_provider_id,
    'total_reviews', v_total,
    'rating', v_avg
  );
end;
$$;

-- Otorgar permiso de ejecución de la función de reseñas a usuarios anónimos y autenticados
grant execute on function public.add_provider_review(text, jsonb) to anon, authenticated;
