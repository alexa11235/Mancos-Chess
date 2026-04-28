import React, { useState, useEffect } from 'react';

const ProposeGameModal = ({ isOpen, onClose, onSave, players, editingGame }) => {
  const [link, setLink] = useState('');
  const [white, setWhite] = useState('');
  const [black, setBlack] = useState('');
  const [result, setResult] = useState('');
  const [proposer, setProposer] = useState('');

  // Si nos pasan un juego para editar, rellenamos los campos
  useEffect(() => {
    if (isOpen) {
      if (editingGame) {
        setLink(editingGame.link);
        setWhite(editingGame.white);
        setBlack(editingGame.black);
        setResult(editingGame.result);
        setProposer(editingGame.proposer);
      } else {
        setLink(''); setWhite(''); setBlack(''); setResult(''); setProposer('');
      }
    }
  }, [isOpen, editingGame]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (link && white && black && result && proposer) {
      // Solo mandamos la data. App.jsx decide si lo cierra o si lanza una alerta de límite.
      onSave({ link, white, black, result, proposer });
    }
  };

  const playerOptions = Object.keys(players).map(p => (
    <option key={p} value={p}>{p}</option>
  ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      {/* Sutilizado borde rosa */}
      <div className="bg-[#1a1a1a] border border-pink-500/30 rounded-lg shadow-2xl w-full max-w-md relative p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        {/* Título simple, sin emoji y rosa sutil */}
        <h2 className="text-xl font-bold text-pink-300 mb-6 border-b border-gray-700 pb-2">
          {editingGame ? 'Editar Partida' : 'Proponer Partida'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Link de Lichess (Obligatorio):</label>
            {/* Input sutilmente rosa al focus */}
            <input type="url" value={link} onChange={e => setLink(e.target.value)} required placeholder="Ej. https://lichess.org/..." className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2 focus:border-pink-400/80 focus:outline-none text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Blancas:</label>
              <select value={white} onChange={e => setWhite(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2 text-sm">
                <option value="" disabled>Elegir...</option>
                {playerOptions}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Negras:</label>
              <select value={black} onChange={e => setBlack(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2 text-sm">
                <option value="" disabled>Elegir...</option>
                {playerOptions}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Resultado:</label>
            <select value={result} onChange={e => setResult(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2 text-sm">
              <option value="" disabled>Elegir...</option>
              <option value="1 - 0">1 - 0 (Blancas)</option>
              <option value="0 - 1">0 - 1 (Negras)</option>
              <option value="½ - ½">½ - ½ (Empate)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-pink-300/80 mb-1 mt-2">¿Quién propone esta joya?</label>
            <select value={proposer} onChange={e => setProposer(e.target.value)} required className="w-full bg-gray-800 border border-pink-700/30 text-white rounded p-2 text-sm focus:border-pink-400/80">
              <option value="" disabled>Soy...</option>
              {playerOptions}
            </select>
          </div>

          <button type="submit" className="w-full py-3 rounded font-bold transition-colors mt-4 bg-pink-500/80 hover:bg-pink-500 text-white shadow-md">
            {editingGame ? 'Guardar Cambios' : 'Enviar Postulación'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposeGameModal;