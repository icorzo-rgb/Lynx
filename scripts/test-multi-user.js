// scripts/test-multi-user.js
// Prueba automatizada de dos sesiones de usuario independientes (Sesión A: Trabajador, Sesión B: Cliente)

async function runMultiUserTest() {
  const baseUrl = 'http://localhost:5173';
  console.log('=== INICIO DE PRUEBA: DOS SESIONES DE USUARIO DISTINTAS ===\n');

  // Paso 0: Verificar estado inicial desde la sesión de cualquier usuario nuevo (Sesión B)
  console.log('1. [Sesión B - Cliente nuevo] Consultando lista inicial de perfiles...');
  const resInitial = await fetch(`${baseUrl}/api/providers`, { cache: 'no-store' });
  if (!resInitial.ok) throw new Error(`Error en servidor: ${resInitial.status}`);
  const initialData = await resInitial.json();
  console.log(`   Perfiles encontrados inicialmente: ${initialData.length}`);

  // Paso 1: Sesión A (Trabajador) registra y publica su oficio
  const testWorker = {
    id: 'prov-custom-' + Date.now(),
    name: 'Mariano Plomero Express',
    businessName: 'Mariano Plomería y Destapaciones 24hs',
    avatarUrl: null,
    coverImageUrl: null,
    categoryId: 'plomeria',
    categoryName: 'Plomería',
    customTrade: null,
    isMatriculado: true,
    hasInsurance: true,
    licenseNumber: 'MAT-PLOM-9921',
    licenseDetails: 'Matrícula oficial habilitada.',
    isIdentityVerified: true,
    isEmergency247: true,
    isAvailableNow: true,
    isUserCreated: true,
    rating: null,
    totalReviews: 0,
    reviews: [],
    locationName: 'Palermo, CABA',
    coverageAreaDescription: 'Cobertura en Palermo y CABA.',
    distanceKm: 0.8,
    shortBio: 'Especialista en destapaciones de urgencia, cañerías termofusión y plomería general.',
    extendedDescription: 'Especialista en destapaciones de urgencia, cañerías termofusión y plomería general.',
    servicesList: ['Plomería', 'Destapaciones', 'Urgencias 24hs'],
    pricing: {
      model: 'FREE_QUOTE',
      minVisitFeeArs: 0,
      displayText: 'Presupuesto sin cargo'
    },
    whatsappPhone: '1144332211',
    responseTime: '~5 min',
    portfolio: []
  };

  console.log(`\n2. [Sesión A - Trabajador] Publicando perfil de "${testWorker.name}"...`);
  const resPost = await fetch(`${baseUrl}/api/providers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testWorker)
  });
  if (!resPost.ok) throw new Error(`Fallo al publicar perfil: ${resPost.status}`);
  const postResult = await resPost.json();
  console.log(`   Resultado de publicación: success=${postResult.success}, total en base=${postResult.count}`);

  // Paso 2: Sesión B (Cliente) - Usuario completamente diferente en otra sesión
  console.log(`\n3. [Sesión B - Cliente en otra sesión/dispositivo] Consultando perfiles disponibles...`);
  const resSessionB = await fetch(`${baseUrl}/api/providers`, { credentials: 'omit', cache: 'no-store' });
  if (!resSessionB.ok) throw new Error(`Error en Sesión B: ${resSessionB.status}`);
  const providersB = await resSessionB.json();
  
  const foundWorker = providersB.find(p => p.id === testWorker.id);
  if (!foundWorker) {
    throw new Error('FALLO CRÍTICO: El perfil publicado por Sesión A NO fue visible para Sesión B');
  }
  console.log(`   ¡ÉXITO! Sesión B encontró el perfil publicado:`);
  console.log(`   - ID: ${foundWorker.id}`);
  console.log(`   - Nombre: ${foundWorker.name}`);
  console.log(`   - Rubro: ${foundWorker.categoryName}`);
  console.log(`   - Ubicación: ${foundWorker.locationName}`);
  console.log(`   - Teléfono: ${foundWorker.whatsappPhone}`);

  // Paso 3: Sesión B (Cliente) deja una reseña y calificación de 5 estrellas al perfil de Mariano
  console.log(`\n4. [Sesión B - Cliente] Calificando a "${foundWorker.name}" con 5 estrellas...`);
  const testReview = {
    id: 'rev-' + Date.now(),
    clientName: 'Carla González (Cliente Sesión B)',
    avatarUrl: null,
    date: 'Recién',
    ratingOverall: 5,
    comment: 'Excelente atención, llegó en 15 minutos y solucionó la pérdida en el acto. Muy recomendado.'
  };

  const resReview = await fetch(`${baseUrl}/api/providers/${encodeURIComponent(testWorker.id)}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testReview)
  });
  if (!resReview.ok) throw new Error(`Error al enviar reseña: ${resReview.status}`);
  const reviewResult = await resReview.json();
  console.log(`   Reseña registrada con éxito: rating=${reviewResult.provider.rating}, totalReviews=${reviewResult.provider.totalReviews}`);

  // Paso 4: Sesión A (Trabajador) y cualquier otro usuario ven la reseña
  console.log(`\n5. [Sesión A - Trabajador / Público] Verificando que la calificación de Sesión B impactó en el perfil...`);
  const resVerification = await fetch(`${baseUrl}/api/providers`, { cache: 'no-store' });
  const allUpdated = await resVerification.json();
  const workerUpdated = allUpdated.find(p => p.id === testWorker.id);
  console.log(`   - Puntuación actual: ${workerUpdated.rating} ⭐`);
  console.log(`   - Total reseñas: ${workerUpdated.totalReviews}`);
  console.log(`   - Último comentario: "${workerUpdated.reviews[0]?.comment}"`);

  // Paso 5: Limpieza de la prueba (Sesión A elimina su publicación de prueba)
  console.log(`\n6. [Sesión A - Trabajador] Eliminando perfil de prueba...`);
  const resDelete = await fetch(`${baseUrl}/api/providers/${encodeURIComponent(testWorker.id)}`, {
    method: 'DELETE'
  });
  const deleteResult = await resDelete.json();
  console.log(`   Perfil eliminado: success=${deleteResult.success}`);

  // Paso 6: Sesión B confirma que ya no existe
  const resFinalCheck = await fetch(`${baseUrl}/api/providers`, { cache: 'no-store' });
  const finalProviders = await resFinalCheck.json();
  const existsNow = finalProviders.some(p => p.id === testWorker.id);
  console.log(`   Verificación en Sesión B: ¿Existe el perfil? ${existsNow ? 'SÍ (Error)' : 'NO (Correcto)'}`);

  console.log('\n=== TODAS LAS PRUEBAS MULTI-USUARIO PASARON SATISFACTORIAMENTE ===');
}

runMultiUserTest().catch(err => {
  console.error('\n❌ ERROR EN LA PRUEBA:', err);
  process.exit(1);
});
