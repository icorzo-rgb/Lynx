// scripts/test-supabase-integration.js
// Script de prueba y diagnóstico de conexión con Supabase

import { createClient } from '@supabase/supabase-js';

async function testSupabase() {
  console.log('=== DIAGNÓSTICO DE INTEGRACIÓN SUPABASE PARA LYNX ===\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('ℹ️  Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no detectadas en el entorno local actual.');
    console.log('   La aplicación funcionará en modo de desarrollo local / fallback offline hasta que se configuren en Vercel o en un archivo .env local.');
    console.log('\n✅ El código cliente y la estructura están preparados para conectarse automáticamente al detectar dichas variables.');
    return;
  }

  console.log(`Conectando a Supabase en: ${supabaseUrl}...`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Probar consulta de lectura pública
  const { data, error } = await supabase.from('providers').select('*').limit(5);

  if (error) {
    if (error.code === '42P01') {
      console.error('❌ Error: La tabla "providers" aún no existe en Supabase.');
      console.log('👉 Ejecuta el archivo SQL "supabase/migrations/20261020_init_lynx_providers.sql" en el SQL Editor de tu panel de Supabase.');
    } else {
      console.error(`❌ Error de consulta en Supabase (${error.code}):`, error.message);
    }
  } else {
    console.log('✅ Conexión con Supabase exitosa.');
    console.log(`✅ Consulta de perfiles públicos activa. Registros encontrados: ${data.length}`);
  }
}

testSupabase().catch(err => {
  console.error('Error imprevisto en la prueba:', err);
});
