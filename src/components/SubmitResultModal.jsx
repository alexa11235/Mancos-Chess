import React, { useState } from 'react';

const SubmitResultModal = ({ isOpen, onClose, currentRound, pairings, onSave }) => {
  if (!isOpen) return null;

  const [selectedMatch, setSelectedMatch] = useState('');
  const [result, setResult] = useState('');
  const [gameLink, setGameLink] = useState(''); // <-- NUEVO ESTADO PARA EL LINK

  if (currentRound === 'Tabla General') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-sm text-center">
          <p className="text-white mb-4">Por favor, selecciona una Ronda específica en el menú principal para subir un resultado.</p>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">Entendido</button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMatch !== '' && result !== '') {
      // Ahora pasamos el gameLink también
      onSave(currentRound, parseInt(selectedMatch), result, gameLink);
      
      // Limpiamos todo al cerrar
      setSelectedMatch('');
      setResult('');
      setGameLink('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl w-full max-w-md relative p-6">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Subir Resultado - {currentRound}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Selector de Partida */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Selecciona la partida:</label>
            <select 
              value={selectedMatch} 
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded p-3 focus:outline-none focus:border-blue-400"
              required
            >
              <option value="" disabled>-- Elige quién jugó --</option>
              {pairings[currentRound].map((match, index) => {
                if (match.bye) return null;
                return (
                  <option key={index} value={index}>
                    {match.white} vs {match.black}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Selector de Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Resultado oficial:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResult('1 - 0')}
                className={`py-3 rounded border font-mono font-bold transition-colors ${result === '1 - 0' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              >
                1 - 0<br/><span className="text-[10px] font-sans font-normal opacity-70">Ganan Blancas</span>
              </button>
              
              <button
                type="button"
                onClick={() => setResult('0 - 1')}
                className={`py-3 rounded border font-mono font-bold transition-colors ${result === '0 - 1' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              >
                0 - 1<br/><span className="text-[10px] font-sans font-normal opacity-70">Ganan Negras</span>
              </button>

              <button
                type="button"
                onClick={() => setResult('½ - ½')}
                className={`py-3 rounded border font-mono font-bold transition-colors ${result === '½ - ½' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              >
                ½ - ½<br/><span className="text-[10px] font-sans font-normal opacity-70">Empate</span>
              </button>

              {/* BOTÓN PARA BORRAR/DESHACER (Tonos rojos más suaves) */}
              <button
                type="button"
                onClick={() => setResult('BORRAR')}
                className={`py-2 rounded border font-sans font-bold transition-colors flex flex-col items-center justify-center ${
                  result === 'BORRAR' 
                    ? 'bg-red-800/65 border-red-800/20 text-red-100' 
                    : 'bg-gray-800 border-gray-600 text-red-500/80 hover:bg-gray-700 hover:text-red-400'
                }`}
              >
                {/* Ícono SVG de bote de basura */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="text-[10px] font-normal opacity-70">Limpiar resultado</span>
              </button>
            </div>
          </div>

          {/* Input para el Link Opcional */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Link de la partida (opcional):</label>
            <input 
              type="url" 
              value={gameLink}
              onChange={(e) => setGameLink(e.target.value)}
              placeholder="Ej. https://lichess.org/..." 
              className="w-full bg-gray-800 border border-gray-600 text-white rounded p-3 focus:outline-none focus:border-blue-400 placeholder-gray-500"
            />
          </div>

          {/* BOTÓN DE GUARDAR CORREGIDO */}
          <button
            type="submit" // <-- Esto es lo que faltaba para que active el form
            disabled={!selectedMatch || !result}
            className={`w-full py-3 rounded font-bold transition-colors mt-6 ${
              !selectedMatch || !result
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                : 'bg-green-800/80 hover:bg-green-700 border border-green-700/50 text-green-100 shadow-md' 
            }`}
          >
            Guardar Resultado
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitResultModal;