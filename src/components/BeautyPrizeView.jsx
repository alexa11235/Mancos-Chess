import React, { useState, useEffect, useRef, useMemo } from 'react';

const BeautyPrizeView = ({ games, currentSubView, players, onLike, onEdit, onDelete }) => {
  const [activeLikeMenu, setActiveLikeMenu] = useState(null);
  const [iframeScale, setIframeScale] = useState(1);
  const cardRefs = useRef([]);

  // LÓGICA DE AVANCE AUTOMÁTICO
  const filteredGames = useMemo(() => {
    // 1. Ronda 1: Pasan todas las propuestas.
    if (currentSubView === 'Ronda 1') return games;

    // Partidas que lograron llegar a Ronda 2 (3 o más votos en R1)
    const gamesInRonda2 = games.filter(g => g.votesR1 && g.votesR1.length >= 3);

    // 2. Ronda 2: Mostrar las que pasaron la R1
    if (currentSubView === 'Ronda 2') {
      return gamesInRonda2;
    }

    // 3. Final: Las 2 con más votos en R2, PERO solo si hay 10+ votos totales en R2
    if (currentSubView === 'Final') {
      // Calculamos cuántos votos totales se han dado en la Ronda 2
      const totalVotesInR2 = gamesInRonda2.reduce((total, g) => total + (g.votesR2?.length || 0), 0);

      // Si no se han juntado 10 votos en total, nadie pasa a la final todavía
      if (totalVotesInR2 < 10) {
        return [];
      }

      // Si ya hay 10 o más votos, pasamos a las 2 mejores
      return [...gamesInRonda2]
        .sort((a, b) => (b.votesR2?.length || 0) - (a.votesR2?.length || 0)) 
        .slice(0, 2); 
    }
    return [];
  }, [games, currentSubView]);

  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth >= 1024) {
        setIframeScale(1);
      } else {
        const firstCard = cardRefs.current[0];
        const cardWidth = firstCard ? firstCard.clientWidth : window.innerWidth;
        setIframeScale(cardWidth / 320);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [filteredGames]);

  const getLichessEmbedUrl = (link) => {
    const match = link.match(/lichess\.org\/(?:embed\/)?([a-zA-Z0-9]{8,12})/);
    if (match) {
      const gameId = match[1].substring(0, 8); 
      return `https://lichess.org/embed/${gameId}?theme=auto&bg=dark`;
    }
    return '';
  };

  return (
    <div className="space-y-8">
      {filteredGames.length === 0 ? (
        <p className="text-center text-gray-500 py-10 italic">
          {currentSubView === 'Ronda 1' 
            ? 'Aún no hay partidas propuestas...' 
            : currentSubView === 'Final'
              ? 'Aún no hay partidas clasificadas (se requieren al menos 10 votos totales en la Ronda 2)...'
              : 'Aún no hay partidas clasificadas para esta etapa...'}
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => {
            const whiteWon = game.result === '1 - 0';
            const blackWon = game.result === '0 - 1';
            const isDraw = game.result === '½ - ½';

            // Identificar qué array de votos usar en la UI
            const activeVoteField = currentSubView === 'Final' ? 'votesFinal' : currentSubView === 'Ronda 2' ? 'votesR2' : 'votesR1';
            const currentVotes = game[activeVoteField] || [];

            return (
              <div key={index} ref={el => cardRefs.current[index] = el} className="bg-[#151515] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                <div className="flex justify-between items-start p-3 bg-[#1a1a1a] border-b border-gray-800 min-h-[56px]">
                  <div className="flex items-start gap-2 flex-1 pr-2">
                    <div className="relative shrink-0">
                      <button onClick={() => setActiveLikeMenu(activeLikeMenu === index ? null : index)} className="p-1.5 rounded-full hover:bg-gray-800 transition-colors" title="Votar por esta partida">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400/70 hover:text-blue-400">
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </button>
                      {activeLikeMenu === index && (
                        <div className="absolute left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl p-2 flex flex-wrap gap-2 w-48 z-20">
                          {Object.values(players).map((p, i) => (
                            <button key={i} onClick={() => { onLike(game, p.inicial); setActiveLikeMenu(null); }} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-[10px] font-bold text-gray-300 border border-gray-600 transition-colors">
                              {p.inicial}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 items-center mt-1">
                      {currentVotes.map((inicial, i) => (
                        <div key={i} className="relative flex items-center justify-center w-6 h-6" title={`Voto de ${inicial}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute inset-0 w-6 h-6 text-blue-400/60">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                          <span className="relative text-[8px] font-bold text-gray-300 mb-[1px]">{inicial}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 shrink-0 items-center mt-1.5">
                    <button onClick={() => onEdit(game)} className="text-gray-500 hover:text-blue-400 transition-colors" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.147l-2.844.71a.75.75 0 01-.927-.927l.71-2.844a4.5 4.5 0 011.147-1.89l11.23-11.23z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
                      </svg>
                    </button>
                    <button onClick={() => onDelete(game)} className="text-gray-500 hover:text-red-400 transition-colors" title="Borrar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-full bg-[#121212] overflow-hidden relative" style={{ height: `${480 * iframeScale}px` }}>
                  {getLichessEmbedUrl(game.link) ? (
                    <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                      <iframe src={getLichessEmbedUrl(game.link)} frameBorder="0" className="pointer-events-auto" style={{ zoom: iframeScale, width: '390px', height: '480px', marginLeft: iframeScale < 1 ? '10px' : '0px' }} />
                    </div>
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Link no válido</div>}
                </div>
                <div className="p-4 bg-[#1a1a1a] mt-auto">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
                    <span className={`text-sm ${whiteWon ? 'font-extrabold text-white' : isDraw ? 'font-bold text-gray-300' : 'text-gray-500'}`}>⚪ {game.white}</span>
                    <span className="font-mono text-xs text-gray-400">{game.result}</span>
                    <span className={`text-sm ${blackWon ? 'font-extrabold text-white' : isDraw ? 'font-bold text-gray-300' : 'text-gray-500'}`}>⚫ {game.black}</span>
                  </div>
                  <div className="text-right text-[10px] text-pink-300/60 italic">Propuesta por: {game.proposer}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BeautyPrizeView;