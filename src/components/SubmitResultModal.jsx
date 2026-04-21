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
                    Blancas: {match.white} vs Negras: {match.black}
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

              {/* NUEVO BOTÓN PARA BORRAR/DESHACER */}
              <button
                type="button"
                onClick={() => setResult('BORRAR')}
                className={`py-3 rounded border font-sans font-bold transition-colors ${result === 'BORRAR' ? 'bg-red-600 border-red-400 text-white' : 'bg-gray-800 border-gray-600 text-red-400 hover:bg-gray-700 hover:text-red-300'}`}
              >
                Deshacer<br/><span className="text-[10px] font-normal opacity-70">Limpiar resultado</span>
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

          {/* Botón de Enviar */}
          <button 
            type="submit" 
            disabled={selectedMatch === '' || result === ''}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded transition-colors mt-4"
          >
            GUARDAR RESULTADO
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitResultModal;