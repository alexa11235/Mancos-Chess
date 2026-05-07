import React from 'react';

const MatchTable = ({ currentPairings, players, onPlayerClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse table-fixed"> 
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-[10px] md:text-sm uppercase tracking-tight md:tracking-wider">
            <th className="py-2 px-1 md:py-3 md:px-4 font-medium w-[31%] md:w-[20%] text-left">Blancas</th>
            <th className="py-2 px-0 md:py-3 md:px-2 font-medium w-[24%] md:w-[50%] text-center">Resultado</th>
            <th className="py-2 px-1 md:py-3 md:px-3 font-medium w-[31%] md:w-[20%] text-left">Negras</th>
            <th className="py-2 px-0 md:py-3 md:px-2 font-medium w-[14%] md:w-[10%] text-center">Partida</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {currentPairings.map((match, index) => {
            if (match.bye) {
              const player = players[match.bye];
              return (
                <tr key={index} className="bg-gray-900/30">
                  <td className="py-3 px-1 md:py-4 md:px-4">
                    <div className="flex items-center gap-1 md:gap-3 overflow-hidden">
                      <button 
                        onClick={() => onPlayerClick({ ...player, nombre: match.bye })}
                        className="w-6 h-6 md:w-8 md:h-8 rounded border border-gray-500 flex items-center justify-center text-[10px] md:text-sm font-bold text-gray-300 hover:bg-gray-700 transition-colors shrink-0"
                      >
                        {player ? player.inicial : match.bye[0]}
                      </button>
                      <span className="text-gray-200 text-[11px] md:text-base truncate block">{match.bye}</span>
                    </div>
                  </td>
                  <td className="py-3 px-1 md:py-4 md:px-2 text-center">
                    <span className="bg-gray-800 text-gray-500 text-[8px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded font-bold">BYE</span>
                  </td>
                  <td className="py-3 px-1 md:py-4 md:px-4 text-gray-600 italic text-[10px] md:text-base truncate">Sin oponente</td>
                  <td className="py-3 px-0 md:py-4 md:px-2 text-center text-gray-600">-</td>
                </tr>
              );
            }

            const playerWhite = players[match.white];
            const playerBlack = players[match.black];

            return (
              <tr key={index} className="hover:bg-gray-800/20 transition-colors">
                <td className="py-3 px-1 md:py-4 md:px-4">
                  <div className="flex items-center gap-1 md:gap-3 overflow-hidden">
                    <button 
                      onClick={() => onPlayerClick({ ...playerWhite, nombre: match.white })}
                      className="w-6 h-6 md:w-8 md:h-8 rounded border border-gray-500 flex items-center justify-center text-[10px] md:text-sm font-bold text-white hover:bg-gray-700 transition-colors shrink-0"
                    >
                      {playerWhite ? playerWhite.inicial : match.white[0]}
                    </button>
                    <span className="text-gray-200 text-[11px] md:text-base truncate block">{match.white}</span>
                  </div>
                </td>
                <td className="py-3 px-1 md:py-4 md:px-2 text-center">
                  <div className="flex items-center justify-center h-full">
                    <span className={
                      match.resultado 
                        ? "inline-flex items-center justify-center w-14 md:w-24 text-center text-green-400 font-bold font-mono text-[11px] md:text-lg bg-green-400/10 py-1 rounded border border-green-400/30" 
                        : "inline-flex items-center justify-center w-14 md:w-20 text-center text-gray-500 font-mono text-[10px] md:text-base py-1"
                    }>
                      {match.resultado 
                        ? match.resultado.replace(" - ", " — ")
                        : "0 - 0"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-1 md:py-4 md:px-4">
                  <div className="flex items-center gap-1 md:gap-3 overflow-hidden">
                    <button 
                      onClick={() => onPlayerClick({ ...playerBlack, nombre: match.black })}
                      className="w-6 h-6 md:w-8 md:h-8 rounded border border-gray-500 flex items-center justify-center text-[10px] md:text-sm font-bold text-white hover:bg-gray-700 transition-colors shrink-0"
                    >
                      {playerBlack ? playerBlack.inicial : match.black[0]}
                    </button>
                    <span className="text-gray-200 text-[11px] md:text-base truncate block">{match.black}</span>
                  </div>
                </td>
                <td className="py-3 px-0 md:py-4 md:px-2 text-center">
                  {match.gameLink ? (
                    <a 
                      href={match.gameLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
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