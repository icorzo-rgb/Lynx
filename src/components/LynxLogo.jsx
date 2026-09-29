import React from 'react';

/**
 * Isotipo y Logotipo oficial de Lynx según la gráfica de referencia exacta.
 * Compuesto por las facetas geométricas del lince y la tipografía serif "Lynx".
 */
export const LynxIcon = ({ className = "w-10 h-10", color = "#7A2EE6" }) => {
  return (
    <svg 
      viewBox="0 0 300 360" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* 1. OREJA IZQUIERDA Y BORDE SUPERIOR EXTERIOR */}
      <path 
        d="M38 32 L122 138 L84 152 L60 94 L62 186 L56 198 L80 162 L38 32 Z" 
        fill={color} 
      />

      {/* 2. SHARD / MECHÓN INTERIOR OREJA IZQUIERDA */}
      <path 
        d="M116 116 L108 140 L76 96 L116 116 Z" 
        fill={color} 
      />

      {/* 3. OREJA DERECHA Y BORDE SUPERIOR EXTERIOR (Simetría) */}
      <path 
        d="M262 32 L178 138 L216 152 L240 94 L238 186 L244 198 L220 162 L262 32 Z" 
        fill={color} 
      />

      {/* 4. SHARD / MECHÓN INTERIOR OREJA DERECHA */}
      <path 
        d="M184 116 L192 140 L224 96 L184 116 Z" 
        fill={color} 
      />

      {/* 5. MECHÓN FRENTE IZQUIERDA (Cejas / Entrecejo) */}
      <path 
        d="M115 160 L108 184 L134 228 L130 196 Z" 
        fill={color} 
      />

      {/* 6. MECHÓN FRENTE DERECHA (Cejas / Entrecejo) */}
      <path 
        d="M185 160 L192 184 L166 228 L170 196 Z" 
        fill={color} 
      />

      {/* 7. OJO IZQUIERDO */}
      <path 
        d="M79 190 L126 215 L129 232 L98 226 Z" 
        fill={color} 
      />

      {/* 8. OJO DERECHO */}
      <path 
        d="M221 190 L174 215 L171 232 L202 226 Z" 
        fill={color} 
      />

      {/* 9. SHARD INFERIOR MEJILLA IZQUIERDA */}
      <path 
        d="M78 214 L62 250 L77 248 L105 292 L75 258 Z" 
        fill={color} 
      />

      {/* 10. SHARD INFERIOR MEJILLA DERECHA */}
      <path 
        d="M222 214 L238 250 L223 248 L195 292 L225 258 Z" 
        fill={color} 
      />

      {/* 11. NARIZ Y HOCICO / BOCA FELINA */}
      <path 
        d="M136 248 C144 246 156 246 164 248 C169 253 162 268 153 273 L153 282 C159 284 167 287 172 290 C167 293 155 291 150 286 C145 291 133 293 128 290 C133 287 141 284 147 282 L147 273 C138 268 131 253 136 248 Z" 
        fill={color} 
      />
    </svg>
  );
};

export const LynxWordmark = ({ className = "h-8", color = "#7A2EE6" }) => {
  return (
    <svg 
      viewBox="0 0 320 100" 
      fill={color} 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* L */}
      <path d="M42 22 L72 22 L72 28 L62 28 L62 68 L88 68 L92 56 L97 56 L95 76 L38 76 L38 68 L48 68 L48 28 L42 28 Z" />

      {/* y */}
      <path d="M102 36 L122 36 L122 41 L114 41 L126 64 L138 41 L130 41 L130 36 L148 36 L148 41 L142 41 L126 74 L122 83 C117 92 108 95 98 92 L96 86 C102 88 108 86 112 80 L115 74 L98 41 L102 41 Z" />

      {/* n */}
      <path d="M152 36 L170 36 L170 41 L163 41 L163 68 L170 68 L170 74 L146 74 L146 68 L153 68 L153 45 L152 45 C158 37 167 35 174 35 C187 35 192 43 192 56 L192 68 L198 68 L198 74 L175 74 L175 68 L181 68 L181 55 C181 46 177 41 170 41 C164 41 159 45 157 52 L157 68 L163 68 L163 74 L146 74 Z" />

      {/* x */}
      <path d="M205 36 L224 36 L224 41 L218 41 L230 55 L242 41 L236 41 L236 36 L254 36 L254 41 L248 41 L234 58 L250 74 L258 74 L258 79 L238 79 L238 74 L244 74 L230 59 L217 74 L222 74 L222 79 L204 79 L204 74 L210 74 L225 57 L211 41 L205 41 Z" />
    </svg>
  );
};

export const LynxLogo = ({ 
  size = "md", // "sm" | "md" | "lg" | "xl"
  showText = true, 
  showSlogan = false,
  variant = "purple", // "purple" | "white"
  layout = "horizontal", // "horizontal" | "vertical"
  onClick = null
}) => {
  const sizeMap = {
    sm: { icon: "w-7 h-7", text: "h-5", slogan: "text-[10px]" },
    md: { icon: "w-9 h-9", text: "h-6 sm:h-7", slogan: "text-[11px]" },
    lg: { icon: "w-16 h-16", text: "h-9", slogan: "text-xs" },
    xl: { icon: "w-28 h-28", text: "h-14", slogan: "text-sm" }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isWhite = variant === "white";
  const mainColor = isWhite ? "#FAF5FF" : "#7A2EE6";

  if (layout === "vertical") {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''}`}
      >
        <LynxIcon className={currentSize.icon} color={mainColor} />
        {showText && (
          <div className="mt-2 flex flex-col items-center">
            <LynxWordmark className={currentSize.text} color={mainColor} />
            {showSlogan && (
              <span className={`font-medium ${currentSize.slogan} ${isWhite ? 'text-purple-200' : 'text-slate-500'} mt-1 text-center`}>
                Conectamos profesionales con oportunidades reales.
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <LynxIcon className={currentSize.icon} color={mainColor} />

      {showText && (
        <div className="flex flex-col justify-center">
          <LynxWordmark className={currentSize.text} color={mainColor} />
          {showSlogan && (
            <span className={`font-medium ${currentSize.slogan} ${isWhite ? 'text-purple-200' : 'text-slate-500'} -mt-0.5`}>
              Conectamos profesionales con oportunidades reales.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
