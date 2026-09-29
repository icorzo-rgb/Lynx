import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';

export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2)?.toUpperCase() || 'LX';
};

export const AvatarDisplay = ({
  name = '',
  avatarUrl = null,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showStatus = false,
  isAvailable = true,
  showVerifiedBadge = false
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 sm:w-16 sm:h-16 text-sm sm:text-base rounded-2xl',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 text-lg sm:text-xl rounded-3xl',
    xl: 'w-28 h-28 sm:w-32 sm:h-32 text-2xl sm:text-3xl rounded-3xl'
  };

  const chosenSize = sizeClasses[size] || sizeClasses.md;
  const initials = getInitials(name);

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${chosenSize} object-cover border-2 border-purple-100 shadow-sm`}
        />
      ) : (
        <div
          className={`${chosenSize} bg-gradient-to-br from-brand-600 via-brand-700 to-purple-900 text-white font-black flex items-center justify-center border-2 border-purple-100 shadow-sm`}
        >
          {initials}
        </div>
      )}

      {/* Indicador En Vivo / Disponible */}
      {showStatus && isAvailable && (
        <span 
          className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5" 
          title="Disponible ahora"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      )}

      {/* Badge Verificado */}
      {showVerifiedBadge && (
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );
};
