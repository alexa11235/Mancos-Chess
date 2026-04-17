import React from 'react';

const MatchTable = ({ currentPairings, players, onPlayerClick }) => {
  return (
    <div className="overflow-x-auto">
      {/* Quitamos table-fixed para que respire mejor */}
      <table className="w-full text-left border-collapse"> 
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
            {/* Porcentajes exactos para empujar a las Negras a la derecha */}
            <th className="py-3 px-4 font-medium w-[0%] text-left">Blancas</th>
            <th className="py-3 px-60 font-medium w-[20%] text-center">Resultado</th>
            <th className="py-3 px-3 font-medium w-[40%] text-left">Negras</th>
            <th className="py-3 px-2 font-medium w-[10%] text-center">Partida</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {currentPairings.map((match, index) => {
            if (match.bye) {
              const player = players[match.bye];
              return (
                <tr key={index} className="bg-gray-900/30">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <button 
                      onClick={() => onPlayerClick({ ...player, nombre: match.bye })}
                      className="w-8 h-8 rounded border border-gray-500 flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-gray-700 transition-colors shrink-0"
                    >
                      {player ? player.inicial : match.bye[0]}
                    </button>
                    <span className="text-gray-300 font-medium truncate">{match.bye}</span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className="bg-gray-800 text-gray-500 text-[10px] px-2 py-1 rounded font-bold">BYE</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 italic text-sm truncate">Sin oponente</td>
                  <td className="py-4 px-2 text-center text-gray-600">-</td>
                </tr>
              );
            }

            const playerWhite = players[match.white];
            const playerBlack = players[match.black];

            return (
              <tr key={index} className="hover:bg-gray-800/20 transition-colors">
                
                {/* BLANCAS */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onPlayerClick({ ...playerWhite, nombre: match.white })}
                      className="w-8 h-8 rounded border border-gray-500 flex items-center justify-center text-xs font-bold text-white hover:bg-gray-700 transition-colors shrink-0"
                    >
                      {playerWhite ? playerWhite.inicial : match.white[0]}
                    </button>
                    <span className="text-gray-200 truncate">{match.white}</span>
                  </div>
                </td>

                {/* RESULTADO */}
                <td className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center h-full">
                    <span className={
                      match.resultado 
                        ? "inline-block w-20 text-center text-green-400 font-bold font-mono text-base bg-green-400/10 py-1 rounded border border-green-400/30" 
                        : "inline-block w-20 text-center text-gray-500 font-mono text-sm py-1"
                    }>
                      {match.resultado 
                        ? match.resultado.replace(" - ", " — ")
                        : "0 - 0"}
                    </span>
                  </div>
                </td>

                {/* NEGRAS */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onPlayerClick({ ...playerBlack, nombre: match.black })}
                      className="w-8 h-8 rounded border border-gray-500 flex items-center justify-center text-xs font-bold text-white hover:bg-gray-700 transition-colors shrink-0"
                    >
                      {playerBlack ? playerBlack.inicial : match.black[0]}
                    </button>
                    <span className="text-gray-200 truncate">{match.black}</span>
                  </div>
                </td>

                {/* PARTIDA */}
                <td className="py-4 px-2 text-center">
                  {match.gameLink ? (
                    <a 
                      href={match.gameLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center justify-center"
                    >
                      {/* Ícono de link SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;