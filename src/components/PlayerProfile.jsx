import React, { useState } from 'react';
import lichessLogo from '../assets/lichess.png';
import chesscomLogo from '../assets/chesscom.png';

const PlayerProfile = ({ player, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!player) return null;

  return (
    <>
      {/* Modal Principal de Perfil */}
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl w-full max-w-sm font-sans text-gray-200 relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            ✕
          </button>

          {/* Cabecera con Foto */}
          <div className="p-6 flex items-center gap-4">
            {player.foto ? (
              <img 
                src={player.foto} 
                alt={player.nombre}
                onClick={() => setIsZoomed(true)}
                className="w-16 h-16 rounded-full border-2 border-gray-500 object-cover cursor-pointer hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-gray-400 flex items-center justify-center text-2xl font-bold text-white bg-transparent">
                {player.inicial}
              </div>
            )}
            <h2 className="text-xl font-semibold text-white">{player.nombre}</h2>
          </div>

          <div className="flex items-center justify-center px-6 mb-4">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-3 text-sm text-gray-400 font-medium tracking-wide">Preferencias</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          <div className="p-6 pt-0 space-y-6">
            {/* Modo de juego */}
            <div>
              <h3 className="font-bold text-md text-white mb-3">Modo de juego</h3>
              <div className="flex flex-col gap-3 ml-4 text-sm">
                {player.modalidad.includes('Presencial con carro') && (
                  <div className="flex items-center gap-2">
                    <span className="w-26 text-gray-300">Presencial</span>
                    <span className="text-green-500 font-bold text-lg">✔</span>
                    <span className="text-lg">🚗</span>
                  </div>
                )}
                {player.modalidad.includes('Presencial sin carro') && (
                  <div className="flex items-center gap-2">
                    <span className="w-26 text-gray-300">Presencial</span>
                    <span className="text-red-500 font-bold text-lg">✖</span>
                    <span className="text-lg">🚗</span>
                  </div>
                )}
                {player.modalidad.includes('En línea') && (
                  <div className="flex items-center gap-2">
                    <span className="w-26 text-gray-300 shrink-0">En línea</span>
                    <div className="flex items-center gap-2"> 
                      <img src={chesscomLogo} alt="Chess.com" className="w-6 h-6 object-contain" />
                      
                      {/* AQUÍ ESTÁ EL DETALLE: rounded-md para todo, rounded-tr-none para la esquina superior derecha cuadrada */}
                      <div className="w-6 h-6 rounded-md rounded-tr-none bg-white flex items-center overflow-hidden">
                        <img 
                          src={lichessLogo} 
                          alt="Lichess" 
                          className="w-[85%] h-[85%] object-contain relative"
                          style={{ left: '2px' }}
                        />
                      </div>

                    </div>
                  </div>
                )}
                {player.modalidad.includes('Casa de Noé') && (
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-gray-300">Sede Alterna</span>
                    <span className="text-lg">🏠</span>
                    <span className="text-xs text-gray-400 italic">Casa de Noé</span>
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

      {/* Overlay de Foto en Grande (Zoom) */}
      {isZoomed && player.foto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[60] cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <img 
            src={player.foto} 
            alt={player.nombre} 
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl border-2 border-gray-500"
          />
          <span className="absolute top-6 right-6 text-white text-3xl font-bold">✕</span>
        </div>
      )}
    </>
  );
};

export default PlayerProfile;