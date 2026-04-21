import React, { useMemo } from 'react';
// Importamos el logo para la diagonal
import tournamentLogo from '../assets/mancos.jpg';

const GeneralStandings = ({ pairings, players, onPlayerClick }) => {
  
  const data = useMemo(() => {
    const stats = {};
    Object.keys(players).forEach(name => {
      stats[name] = { 
        nombre: name, 
        inicial: players[name].inicial,
        puntos: 0,
        resultadosContra: {} 
      };
    });

    Object.values(pairings).forEach(roundMatches => {
      roundMatches.forEach(match => {
        if (match.bye || !match.resultado) return;
        const w = match.white;
        const b = match.black;
        const res = match.resultado;

        if (res === '1 - 0') {
          stats[w].puntos += 1;
          stats[w].resultadosContra[b] = '1';
          stats[b].resultadosContra[w] = '0';
        } else if (res === '0 - 1') {
          stats[b].puntos += 1;
          stats[b].resultadosContra[w] = '1';
          stats[w].resultadosContra[b] = '0';
        } else if (res === '½ - ½') {
          stats[w].puntos += 0.5;
          stats[b].puntos += 0.5;
          stats[w].resultadosContra[b] = '½';
          stats[b].resultadosContra[w] = '½';
        }
      });
    });

    const sortedPlayers = Object.values(stats).sort((a, b) => b.puntos - a.puntos);
    return { sortedPlayers };
  }, [pairings, players]);

  const { sortedPlayers } = data;

  return (
    <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg shadow-2xl">
      {/* Mantenemos el table-fixed para que los porcentajes funcionen a la fuerza */}
      <table className="w-full border-collapse text-sm table-fixed">
        <thead>
          <tr className="bg-black/40 text-gray-400">
            {/* Jugadores: 28% en móvil, w-48 en escritorio */}
            <th className="p-1 md:p-4 text-left font-bold w-[28%] md:w-48 border-r border-gray-800 text-[8px] md:text-sm">
              Jugadores
            </th>
            {/* Matriz: 6% cada una en móvil, w-12 en escritorio */}
            {sortedPlayers.map((p, i) => (
              <th key={i} className="p-0 md:p-2 text-center border-r border-gray-800 w-[6%] md:w-12 text-[8px] md:text-sm">
                {i + 1}
              </th>
            ))}
            {/* PTS: 10% en móvil, w-20 en escritorio */}
            <th className="p-0 md:p-4 text-center font-bold text-white w-[10%] md:w-20 border-l-2 border-gray-700 text-[8px] md:text-sm">
              PTS
            </th>
            {/* Rank: 8% en móvil, w-16 en escritorio */}
            <th className="p-0 md:p-4 text-center font-bold text-blue-400 w-[8%] md:w-16 text-[8px] md:text-sm">
              #
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((playerRow, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-800 hover:bg-white/5">
              
              {/* Celda de Jugadores */}
              <td className="p-1 md:p-3 border-r border-gray-800 flex items-center gap-1 md:gap-3 bg-black/10 overflow-hidden">
                <button 
                  onClick={() => onPlayerClick({ ...players[playerRow.nombre], nombre: playerRow.nombre })}
                  className="w-4 h-4 md:w-7 md:h-7 rounded border border-gray-600 flex items-center justify-center text-[7px] md:text-[10px] font-bold text-white shrink-0"
                >
                  {playerRow.inicial}
                </button>
                <span className="text-gray-200 font-medium truncate text-[8px] md:text-sm">{playerRow.nombre}</span>
              </td>

              {/* Celdas de Resultados */}
              {sortedPlayers.map((playerCol, colIndex) => {
                const esDiagonal = rowIndex === colIndex;
                const resultado = playerRow.resultadosContra[playerCol.nombre];

                return (
                  <td 
                    key={colIndex} 
                    className={`p-0 border-r border-gray-800 text-center relative h-6 md:h-12 ${
                      esDiagonal ? 'bg-[#121212]' : ''
                    }`}
                  >
                    {esDiagonal ? (
                      <div className="absolute inset-0 flex items-center justify-center p-0.5 md:p-2">
                         <img 
                           src={tournamentLogo} 
                           alt="Mancos" 
                           className="w-full h-full object-contain opacity-30 hover:opacity-60 transition-all duration-300"
                         />
                      </div>
                    ) : (
                      <span className={`font-mono font-bold text-[8px] md:text-base ${
                        resultado === '1' ? 'text-green-400' : 
                        resultado === '0' ? 'text-red-400' : 
                        'text-gray-500'
                      }`}>
                        {resultado || '-'}
                      </span>
                    )}
                  </td>
                );
              })}

              {/* Celda PTS */}
              <td className="p-0 md:p-3 text-center font-bold text-white text-[9px] md:text-lg border-l-2 border-gray-700 bg-black/30">
                {playerRow.puntos}
              </td>

              {/* Celda Posición */}
              <td className="p-0 md:p-3 text-center">
                <span className={`inline-flex items-center justify-center w-3 h-3 md:w-6 md:h-6 rounded-full font-bold text-[7px] md:text-[10px] ${
                  rowIndex === 0 ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                  rowIndex === 1 ? 'bg-gray-300 text-black' :
                  rowIndex === 2 ? 'bg-amber-700 text-white' :
                  'text-gray-500 border border-gray-800'
                }`}>
                  {rowIndex + 1}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneralStandings;