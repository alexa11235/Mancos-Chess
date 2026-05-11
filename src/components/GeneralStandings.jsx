import React, { useMemo } from 'react';
import tournamentLogo from '../assets/mancos.jpg';

const GeneralStandings = ({ pairings, players, onPlayerClick, onLogoClick }) => {
  
  const data = useMemo(() => {
    const getMexicoDate = () => {
      const now = new Date();
      return new Date(now.toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
    };

    const today = getMexicoDate();
    
    // Nuevo calendario de Miércoles: Define cuándo se "libera" el punto del BYE
    const byeSchedule = {
      'Ronda 1': new Date('2026-04-22T00:00:00'),
      'Ronda 2': new Date('2026-04-29T00:00:00'),
      'Ronda 3': new Date('2026-05-06T00:00:00'),
      'Ronda 4': new Date('2026-05-13T00:00:00'),
      'Ronda 5': new Date('2026-05-20T00:00:00'),
      'Ronda 6': new Date('2026-05-27T00:00:00'),
      'Ronda 7': new Date('2026-06-03T00:00:00'),
      'Ronda 8': new Date('2026-06-10T00:00:00'),
      'Ronda 9': new Date('2026-06-17T00:00:00'),
    };

    const stats = {};
    Object.keys(players).forEach(name => {
      stats[name] = { 
        nombre: name, 
        inicial: players[name].inicial,
        puntos: 0,
        resultadosContra: {},
        totalByes: 0 
      };
    });

    Object.entries(pairings).forEach(([roundName, roundMatches]) => {
      // Verificamos si ya es miércoles o posterior para esta ronda específica
      const isByeActive = today >= byeSchedule[roundName];

      roundMatches.forEach(match => {
        // ADIÓS PARCHES: La base de datos está limpia, tomamos los nombres directos
        const byePlayer = match.bye;
        const w = match.white;
        const b = match.black;

        if (byePlayer) {
          // Solo sumamos el punto y el icono si la fecha del BYE ya se cumplió
          if (isByeActive && stats[byePlayer]) {
            stats[byePlayer].puntos += 1;
            stats[byePlayer].totalByes += 1;
          }
          return; 
        }

        if (!match.resultado) return;
        const res = match.resultado;

        // PARCHE DE SEGURIDAD: Si el jugador no existe en 'players', ignora la partida en vez de crashear
        if (!stats[w] || !stats[b]) return;

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
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr className="bg-black/40 text-gray-400">
            <th className="p-1 md:p-4 text-left font-bold w-[26%] md:w-48 border-r border-gray-800 text-[9px] md:text-sm">
              Jugadores
            </th>
            {sortedPlayers.map((p, i) => (
              <th key={i} className="p-0 md:p-2 text-center border-r border-gray-800 w-[6.5%] md:w-12 text-[8px] md:text-sm">
                {i + 1}
              </th>
            ))}
            <th className="p-0 md:p-4 text-center font-bold text-white w-[8%] md:w-20 border-l-2 border-gray-700 text-[8px] md:text-sm">
              PTS
            </th>
            <th className="p-0 md:p-4 text-center font-bold text-blue-400 w-[7.5%] md:w-16 text-[8px] md:text-sm">
              #
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((playerRow, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-800 hover:bg-white/5">
              
              <td className="p-1 md:p-3 border-r border-gray-800 bg-black/10 align-middle">
                <div className="flex items-center gap-1 md:gap-3 overflow-hidden h-full">
                  <button 
                    onClick={() => onPlayerClick({ ...players[playerRow.nombre], nombre: playerRow.nombre })}
                    className="w-4 h-4 md:w-7 md:h-7 rounded border border-gray-600 flex items-center justify-center text-[7px] md:text-[10px] font-bold text-white shrink-0"
                  >
                    {playerRow.inicial}
                  </button>
                  <span className="text-gray-200 font-medium truncate flex-1 min-w-0 text-[8px] md:text-sm">
                    {playerRow.nombre}
                  </span>
                </div>
              </td>

              {sortedPlayers.map((playerCol, colIndex) => {
                const esDiagonal = rowIndex === colIndex;
                const resultado = playerRow.resultadosContra[playerCol.nombre];

                return (
                  <td 
                    key={colIndex} 
                    className={`p-0 border-r border-gray-800 text-center relative h-8 md:h-12 ${
                      esDiagonal ? 'bg-[#121212]' : ''
                    }`}
                  >
                    {esDiagonal ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 md:p-2">
                         {playerRow.totalByes > 0 && (
                          <span className="absolute z-10 text-blue-400 font-mono font-bold text-[10px] md:text-base">
                            +{playerRow.totalByes}
                          </span>
                        )}
                         <img 
                           src={tournamentLogo} 
                           alt="Mancos" 
                           onClick={onLogoClick} 
                           className="w-full h-full object-contain opacity-30 hover:opacity-60 cursor-pointer transition-all duration-300"
                         />
                      </div>
                    ) : (
                      <span className={`font-mono font-bold text-[10px] md:text-base ${
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

              <td className="p-0 md:p-3 text-center font-bold text-white text-[10px] md:text-lg border-l-2 border-gray-700 bg-black/30">
                {playerRow.puntos}
              </td>

              <td className="p-0 md:p-3 text-center">
                <span className={`inline-flex items-center justify-center w-4 h-4 md:w-6 md:h-6 rounded-full font-bold text-[8px] md:text-[10px] ${
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