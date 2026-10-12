import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { CategoryGrid } from './components/CategoryGrid';
import { ProviderCard } from './components/ProviderCard';
import { ProviderProfileModal } from './components/ProviderProfileModal';
import { ChatModal } from './components/ChatModal';
import { WhatsAppDirectModal } from './components/WhatsAppDirectModal';
import { ReviewModal } from './components/ReviewModal';
import { RegisterProviderModal } from './components/RegisterProviderModal';
import { LocationRadarModal } from './components/LocationRadarModal';
import { CategoryModal } from './components/CategoryModal';
import { FavoritesModal } from './components/FavoritesModal';
import { MyPublicationsModal } from './components/MyPublicationsModal';
import { SettingsModal } from './components/SettingsModal';
import { WelcomeSplashModal } from './components/WelcomeSplashModal';
import { BottomNav } from './components/BottomNav';
import { StatsSection } from './components/StatsSection';
import { Footer } from './components/Footer';
import { 
  getStoredProviders, 
  saveStoredProviders, 
  getStoredFavorites, 
  saveStoredFavorites, 
  ARGENTINA_LOCATIONS 
} from './data/mockData';
import { 
  Plus, 
  Sparkles, 
  ChevronRight, 
  UserPlus, 
  RefreshCw 
} from 'lucide-react';

export function App() {
  // Estado de Datos y Persistencia Real en LocalStorage
  const [providers, setProviders] = useState(() => getStoredProviders());
  const [favorites, setFavorites] = useState(() => getStoredFavorites());

  // Filtros de Búsqueda
  const [selectedLocation, setSelectedLocation] = useState(ARGENTINA_LOCATIONS[0]);
  const [searchRadiusKm, setSearchRadiusKm] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMatriculados, setOnlyMatriculados] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [freeQuoteOnly, setFreeQuoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState('DISTANCE'); // 'DISTANCE' | 'RATING' | 'REVIEWS'

  // Estados de Modales y Vistas
  const [showSplash, setShowSplash] = useState(false);
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMyPublicationsModal, setShowMyPublicationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [chatProvider, setChatProvider] = useState(null);
  const [whatsAppProvider, setWhatsAppProvider] = useState(null);
  const [reviewProvider, setReviewProvider] = useState(null);

  // Barra de Navegación Inferior
  const [activeBottomTab, setActiveBottomTab] = useState('inicio');

  // Guardar en localStorage cada vez que cambien providers o favorites
  useEffect(() => {
    saveStoredProviders(providers);
  }, [providers]);

  useEffect(() => {
    saveStoredFavorites(favorites);
  }, [favorites]);

  // Manejo de Favoritos
  const handleToggleFavorite = (providerId) => {
    setFavorites((prev) => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      } else {
        return [...prev, providerId];
      }
    });
  };

  // Filtrado y Ordenamiento Dinámico de Personas Reales
  const filteredProviders = useMemo(() => {
    return providers
      .filter((p) => {
        // Filtro por Rubro
        if (selectedCategory !== 'todos' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Filtro por Búsqueda de Texto
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesBusiness = p.businessName?.toLowerCase().includes(q);
          const matchesCat = p.categoryName.toLowerCase().includes(q);
          const matchesCustom = p.customTrade?.toLowerCase().includes(q);
          const matchesBio = p.shortBio?.toLowerCase().includes(q);
          if (!matchesName && !matchesBusiness && !matchesCat && !matchesBio && !matchesCustom) {
            return false;
          }
        }

        // Filtro Solo Matriculados
        if (onlyMatriculados && !p.isMatriculado) {
          return false;
        }

        // Filtro Guardia 24hs / Urgencias
        if (emergencyOnly && !p.isEmergency247) {
          return false;
        }

        // Filtro Presupuesto sin Cargo
        if (freeQuoteOnly && p.pricing?.model !== 'FREE_QUOTE') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'DISTANCE') {
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        }
        if (sortBy === 'RATING') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'REVIEWS') {
          return (b.totalReviews || 0) - (a.totalReviews || 0);
        }
        return 0;
      });
  }, [providers, selectedCategory, searchQuery, onlyMatriculados, emergencyOnly, freeQuoteOnly, sortBy]);

  // Manejador del Sistema de Puntuación (Estrellas de 0 a 5 sin puntuaciones ficticias)
  const handleAddReview = (providerId, newReview) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          const updatedReviews = [newReview, ...(p.reviews || [])];
          const newTotal = updatedReviews.length;
          const sumRatings = updatedReviews.reduce((acc, r) => acc + (Number(r.ratingOverall) || 0), 0);
          const newAvg = parseFloat((sumRatings / newTotal).toFixed(1));

          return {
            ...p,
            totalReviews: newTotal,
            rating: newAvg,
            reviews: updatedReviews
          };
        }
        return p;
      })
    );

    if (selectedProvider && selectedProvider.id === providerId) {
      setSelectedProvider((prev) => {
        const updatedReviews = [newReview, ...(prev.reviews || [])];
        const newTotal = updatedReviews.length;
        const sumRatings = updatedReviews.reduce((acc, r) => acc + (Number(r.ratingOverall) || 0), 0);
        const newAvg = parseFloat((sumRatings / newTotal).toFixed(1));
        return {
          ...prev,
          totalReviews: newTotal,
          rating: newAvg,
          reviews: updatedReviews
        };
      });
    }
  };

  // Manejador para registrar nuevo trabajador / oficio
  const handleAddProvider = (newProvider) => {
    setProviders((prev) => [newProvider, ...prev]);
  };

  const handleDeleteProvider = (providerId) => {
    setProviders((prev) => prev.filter(p => p.id !== providerId));
  };

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setOnlyMatriculados(false);
    setEmergencyOnly(false);
    setFreeQuoteOnly(false);
  };

  const handleBottomTabSelect = (tab) => {
    setActiveBottomTab(tab);
    if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'busqueda') {
      setShowCategoryModal(true);
    } else if (tab === 'mensajes') {
      if (providers.length > 0) {
        setChatProvider(providers[0]);
      } else {
        setShowMyPublicationsModal(true);
      }
    } else if (tab === 'perfil') {
      setShowMyPublicationsModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF] text-slate-800 pb-16 sm:pb-0">
      
      {/* Barra de Navegación Lynx */}
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onOpenRadarModal={() => setShowRadarModal(true)}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        onOpenNotifications={() => setShowSplash(true)}
        onOpenProfile={() => setShowMyPublicationsModal(true)}
      />

      {/* Hero Principal con Saludo, Ubicación, 6 Accesos Rápidos y Banner */}
      <HeroSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onOpenRadarModal={() => setShowRadarModal(true)}
        onOpenCategoryModal={() => setShowCategoryModal(true)}
        onOpenMyPublications={() => setShowMyPublicationsModal(true)}
        onOpenMessages={() => {
          if (providers.length > 0) {
            setChatProvider(providers[0]);
          } else {
            setShowRegisterModal(true);
          }
        }}
        onOpenFavorites={() => setShowFavoritesModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onlyMatriculados={onlyMatriculados}
        onToggleMatriculados={() => setOnlyMatriculados(!onlyMatriculados)}
        emergencyOnly={emergencyOnly}
        onToggleEmergency={() => setEmergencyOnly(!emergencyOnly)}
        freeQuoteOnly={freeQuoteOnly}
        onToggleFreeQuote={() => setFreeQuoteOnly(!freeQuoteOnly)}
        totalResults={filteredProviders.length}
      />

      {/* Explorador de Especialidades */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Sección: Profesionales Reales Registrados en Lynx */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Trabajos destacados cerca de ti
              </h2>
              <span className="text-xs font-bold text-brand-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                {filteredProviders.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              En {selectedLocation.name} (radio {searchRadiusKm} km)
            </p>
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="text-xs font-extrabold text-brand-700 hover:text-brand-900 flex items-center gap-1 sm:hidden"
            >
              <span>Ver rubros</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-white border border-purple-100 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm cursor-pointer"
              >
                <option value="DISTANCE">📍 Más cercanos</option>
                <option value="RATING">⭐ Mejor valorados</option>
                <option value="REVIEWS">💬 Más contrataciones</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Tarjetas de Profesionales Reales */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isFavorite={favorites.includes(provider.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={(p) => setSelectedProvider(p)}
                onOpenChat={(p) => setChatProvider(p)}
                onOpenWhatsApp={(p) => setWhatsAppProvider(p)}
              />
            ))}
          </div>
        ) : (
          /* Estado cuando aún no hay registros o los filtros no arrojan resultados */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-purple-100 shadow-soft max-w-lg mx-auto space-y-4 my-6">
            <div className="w-16 h-16 rounded-3xl bg-purple-100/80 text-brand-700 flex items-center justify-center mx-auto shadow-inner">
              <UserPlus className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                {providers.length === 0 
                  ? '¡Sé el primer profesional en sumarte a Lynx!' 
                  : 'No se encontraron profesionales con estos filtros'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                {providers.length === 0
                  ? 'La plataforma está lista para que trabajadores reales publiquen sus oficios en su zona. Registrá tu servicio de manera gratuita y empezá a recibir clientes directos.'
                  : 'Probá ampliando los filtros de búsqueda o buscando en otra categoría o zona de cobertura.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-black shadow-md shadow-brand-700/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Sumar mi Oficio en Lynx</span>
              </button>

              {providers.length > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-brand-700 text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restablecer Filtros</span>
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Sección de Confianza Lynx */}
      <StatsSection />

      {/* Pie de Página */}
      <Footer 
        onOpenRadarModal={() => setShowRadarModal(true)}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        onOpenCategoryModal={() => setShowCategoryModal(true)}
      />

      {/* Barra de Navegación Inferior */}
      <BottomNav
        activeTab={activeBottomTab}
        onSelectTab={handleBottomTabSelect}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        unreadCount={0}
      />

      {/* Modales */}
      {showSplash && (
        <WelcomeSplashModal
          onClose={() => setShowSplash(false)}
          onStart={() => setShowSplash(false)}
        />
      )}

      {showRadarModal && (
        <LocationRadarModal
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          searchRadiusKm={searchRadiusKm}
          onApplyRadius={setSearchRadiusKm}
          onClose={() => setShowRadarModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showRegisterModal && (
        <RegisterProviderModal
          onClose={() => setShowRegisterModal(false)}
          onAddProvider={handleAddProvider}
          onSelectProvider={(p) => setSelectedProvider(p)}
        />
      )}

      {selectedProvider && (
        <ProviderProfileModal
          provider={selectedProvider}
          isFavorite={favorites.includes(selectedProvider.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedProvider(null)}
          onOpenChat={(p) => {
            setSelectedProvider(null);
            setChatProvider(p);
          }}
          onOpenWhatsApp={(p) => {
            setSelectedProvider(null);
            setWhatsAppProvider(p);
          }}
          onOpenReviewModal={(p) => setReviewProvider(p)}
        />
      )}

      {chatProvider && (
        <ChatModal
          provider={chatProvider}
          onClose={() => setChatProvider(null)}
          onOpenWhatsApp={(p) => {
            setChatProvider(null);
            setWhatsAppProvider(p);
          }}
        />
      )}

      {whatsAppProvider && (
        <WhatsAppDirectModal
          provider={whatsAppProvider}
          onClose={() => setWhatsAppProvider(null)}
        />
      )}

      {reviewProvider && (
        <ReviewModal
          provider={reviewProvider}
          onClose={() => setReviewProvider(null)}
          onSubmitReview={handleAddReview}
        />
      )}

      {showFavoritesModal && (
        <FavoritesModal
          favorites={favorites}
          providers={providers}
          onToggleFavorite={handleToggleFavorite}
          onSelectProvider={(p) => setSelectedProvider(p)}
          onOpenChat={(p) => setChatProvider(p)}
          onOpenWhatsApp={(p) => setWhatsAppProvider(p)}
          onClose={() => setShowFavoritesModal(false)}
        />
      )}

      {showMyPublicationsModal && (
        <MyPublicationsModal
          providers={providers}
          onOpenRegisterModal={() => setShowRegisterModal(true)}
          onSelectProvider={(p) => setSelectedProvider(p)}
          onDeleteProvider={handleDeleteProvider}
          onClose={() => setShowMyPublicationsModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onOpenSplash={() => setShowSplash(true)}
        />
      )}

    </div>
  );
}
