import React from 'react';
// Importamos las imágenes desde la carpeta assets
import lichessLogo from '../assets/lichess.png';
import chesscomLogo from '../assets/chesscom.png';

const PlayerProfile = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl w-full max-w-sm font-sans text-gray-200 relative">
        
        {/* Botón de cierre superior X */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Cabecera */}
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg border-2 border-gray-400 flex items-center justify-center text-2xl font-bold text-white bg-transparent">
            {player.inicial}
          </div>
          <h2 className="text-xl font-semibold text-white">{player.nombre}</h2>
        </div>

        {/* Separador */}
        <div className="flex items-center justify-center px-6 mb-4">
          <div className="flex-grow h-px bg-gray-600"></div>
          <span className="px-3 text-sm text-gray-400 font-medium tracking-wide">Preferencias</span>
          <div className="flex-grow h-px bg-gray-600"></div>
        </div>

        {/* Contenido */}
        <div className="p-6 pt-0 space-y-6">
          
          {/* Modo de juego Dinámico */}
          <div>
            <h3 className="font-bold text-md text-white mb-3">Modo de juego</h3>
            <div className="flex flex-col gap-3 ml-4 text-sm">
              
              {/* Opción: Presencial con carro */}
              {player.modalidad.includes('Presencial con carro') && (
                <div className="flex items-center gap-2">
                  <span className="w-26 text-gray-300">Presencial</span>
                  <span className="text-green-500 font-bold text-lg">✔</span>
                  <span className="text-lg">🚗</span>
                </div>
              )}

              {/* Opción: Presencial sin carro */}
              {player.modalidad.includes('Presencial sin carro') && (
                <div className="flex items-center gap-2">
                  <span className="w-26 text-gray-300">Presencial</span>
                  <span className="text-red-500 font-bold text-lg">✖</span>
                  <span className="text-lg">🚗</span>
                </div>
              )}
            {/* Opción: En línea (Iconos alineados a la izquierda y limpieza de bordes) */}
          {player.modalidad.includes('En línea') && (
                <div className="flex items-center gap-2">
                  <span className="w-26 text-gray-300 shrink-0">En línea</span>
                  <div className="flex items-center gap-2"> 
                    <img 
                      src={chesscomLogo} 
                      alt="Chess.com" 
                      className="w-6 h-6 object-contain" 
                    />
                    <div className="w-6 h-6 rounded-md bg-white flex items-center overflow-hidden">
                      <img 
                        src={lichessLogo} 
                        alt="Lichess" 
                        className="w-[85%] h-[85%] object-contain relative"
                        style={{ 
                        /* Ajusta este valor: 
                            Positivo (1px) para mover a la derecha
                            Negativo (-1px) para mover a la izquierda */
                        left: '2px' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Opción: Casa de Noé */}
              {player.modalidad.includes('Casa de Noé') && (
                <div className="flex items-center gap-3">
                  <span className="w-24 text-gray-300">Sede Alterna</span>
                  <span className="text-lg">🏠</span>
                  <span className="text-xs text-gray-400 italic">Casa de Noé</span>
                </div>
              )}

              {/* Opción: Pendiente */}
              {player.modalidad.includes('Pendiente') && (
                <div className="flex items-center gap-3 text-gray-500 italic">
                  <span>Aún no responde la encuesta</span>
                </div>
              )}

            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <h3 className="font-bold text-md text-white mb-2">Disponibilidad</h3>
            <p className="ml-4 text-sm text-gray-300 italic leading-relaxed">
              "{player.disponibilidad}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlayerProfile;