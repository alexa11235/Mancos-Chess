import React, { useState, useEffect, useRef, useMemo } from 'react';

const BeautyPrizeView = ({ games, currentSubView, players, onLike, onEdit, onDelete }) => {
  const [activeLikeMenu, setActiveLikeMenu] = useState(null);
  const [iframeScale, setIframeScale] = useState(1);
  const [expandedGame, setExpandedGame] = useState(null);
  const cardRefs = useRef([]);

  const filteredGames = useMemo(() => {
    if (currentSubView === 'Eliminatoria') return games;
    
    if (currentSubView === 'Final') {
      const totalVotesInEliminatoria = games.reduce((total, g) => total + (g.votesEliminatoria?.length || 0), 0);
      if (totalVotesInEliminatoria < 10) return [];
      
      return [...games]
        .sort((a, b) => (b.votesEliminatoria?.length || 0) - (a.votesEliminatoria?.length || 0))
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

  // Se retiraron los intentos de orientación fallidos; la API de embed de partidas no lo soporta.
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
          {currentSubView === 'Eliminatoria'
            ? 'Aún no hay partidas propuestas...'
            : 'Aún no hay partidas clasificadas (se requieren al menos 10 votos totales en la Eliminatoria)...'}
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => {
            const whiteWon = game.result === '1 - 0';
            const blackWon = game.result === '0 - 1';
            const isDraw = game.result === '½ - ½';
            const activeVoteField = currentSubView === 'Final' ? 'votesFinal' : 'votesEliminatoria';
            const currentVotes = game[activeVoteField] || [];
            const embedUrl = getLichessEmbedUrl(game.link);

            return (
              <div key={index} ref={el => cardRefs.current[index] = el} className="bg-[#151515] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                
                {/* CABECERA */}
                <div className="flex justify-between items-start p-3 bg-[#1a1a1a] border-b border-gray-800 min-h-[56px] z-10 relative">
                  <div className="flex items-start gap-2 flex-1 pr-2">
                    <div className="relative shrink-0">
                      <button 
                        onClick={() => setActiveLikeMenu(activeLikeMenu === index ? null : index)} 
                        className="p-1.5 rounded-full hover:bg-gray-800 transition-colors focus:outline-none" 
                        title="Votar por esta partida"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400/70 hover:text-blue-400">
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </button>
                      
                      {activeLikeMenu === index && (
                        <div className="absolute left-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl p-2 flex flex-wrap gap-2 w-48 z-20">
                          {Object.entries(players).map(([nombrePlayer, p], i) => (
                            <button 
                              key={i} 
                              onClick={() => { onLike(game, p.inicial); setActiveLikeMenu(null); }} 
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-[10px] font-bold text-gray-300 border border-gray-600 transition-colors focus:outline-none"
                              title={nombrePlayer}
                            >
                              {p.inicial}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 items-center mt-1">
                      {currentVotes.map((inicial, i) => {
                        const nombreVotante = Object.entries(players).find(([_, playerInfo]) => playerInfo.inicial === inicial)?.[0] || inicial;
                        return (
                          <div key={i} className="relative flex items-center justify-center w-6 h-6" title={`Voto de ${nombreVotante}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute inset-0 w-6 h-6 text-blue-400/60">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span className="relative text-[8px] font-bold text-gray-300 mb-[1px]">{inicial}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 shrink-0 items-center mt-1.5 z-10 relative">
                    <button onClick={() => setExpandedGame(game)} className="text-gray-400 hover:text-white transition-colors focus:outline-none" title="Ampliar vista">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </button>
                    <a href={game.link} target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-300 transition-colors focus:outline-none" title="Abrir en lichess">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[18px] h-[18px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* CONTENEDOR DEL RECORTE (Vista Tarjeta) */}
                <div
                  className="w-full bg-[#121212] flex justify-center items-center overflow-hidden"
                  style={{ height: `${480 * iframeScale}px` }}
                >
                  {embedUrl ? (
                    <div 
                      className="relative overflow-hidden bg-[#121212]" 
                      style={{ 
                        width: '390px', 
                        height: '480px', 
                        zoom: iframeScale,
                        marginLeft: iframeScale < 1 ? '10px' : '0px'
                      }}
                    >
                      {/* CALIBRACIÓN X: -0.5px. Corta exactamente 0.5px a la izquierda y 5.5px a la derecha. */}
                      <iframe
                        src={embedUrl}
                        frameBorder="0"
                        scrolling="no"
                        className="absolute"
                        style={{ 
                          width: '396px', 
                          height: '488px', 
                          top: '-4px', 
                          left: '-0.5px'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Link no válido</div>
                  )}
                </div>

                {/* PIE DE TARJETA */}
                <div className="p-4 bg-[#1a1a1a] mt-auto border-t border-gray-800 z-10 relative">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
                    <span className={`text-sm ${whiteWon ? 'font-extrabold text-white' : isDraw ? 'font-bold text-gray-300' : 'text-gray-500'}`}>⚪ {game.white}</span>
                    <span className="font-mono text-xs text-gray-400">{game.result}</span>
                    <span className={`text-sm ${blackWon ? 'font-extrabold text-white' : isDraw ? 'font-bold text-gray-300' : 'text-gray-500'}`}>⚫ {game.black}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] text-pink-300/60 italic">Propuesta por: {game.proposer}</div>
                    <div className="flex gap-4 items-center">
                      <button onClick={() => onEdit(game)} className="text-gray-500 hover:text-blue-400 transition-colors focus:outline-none" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.147l-2.844.71a.75.75 0 01-.927-.927l.71-2.844a4.5 4.5 0 011.147-1.89l11.23-11.23z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
                        </svg>
                      </button>
                      <button onClick={() => onDelete(game)} className="text-gray-500 hover:text-red-400 transition-colors focus:outline-none" title="Borrar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de expansión */}
      {expandedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setExpandedGame(null)}>
          <div className="relative bg-[#151515] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 py-3 bg-[#1a1a1a] border-b border-gray-800 relative z-10">
              <div className="flex gap-3 text-sm">
                <span className={expandedGame.result === '1 - 0' ? 'font-extrabold text-white' : 'text-gray-500'}>⚪ {expandedGame.white}</span>
                <span className="font-mono text-gray-400">{expandedGame.result}</span>
                <span className={expandedGame.result === '0 - 1' ? 'font-extrabold text-white' : 'text-gray-500'}>⚫ {expandedGame.black}</span>
              </div>
              <button onClick={() => setExpandedGame(null)} className="text-gray-500 hover:text-white transition-colors focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* CONTENEDOR MODAL: Clip-path con fondo de camuflaje (Mantiene el recorte perfecto de 18px que tenías) */}
            <div 
              className="w-full relative overflow-hidden" 
              style={{ 
                height: '560px',
                backgroundColor: '#262421' /* Color Lichess para camuflar el recorte */
              }}
            >
              <iframe 
                src={getLichessEmbedUrl(expandedGame.link)} 
                frameBorder="0" 
                scrolling="no"
                className="absolute focus:outline-none !outline-none" 
                style={{ 
                  width: 'calc(100% + 6px)', 
                  left: '-3px',
                  height: 'calc(100% + 4px)', /* 560px + 4px de arriba */
                  top: '-4px', 
                  outline: 'none',
                  border: 'none',
                  clipPath: 'inset(0px 0px 18px 0px)' /* Recorta exactamente los 18px inferiores */
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautyPrizeView;