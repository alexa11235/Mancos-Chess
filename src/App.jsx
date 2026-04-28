import { useState, useEffect } from 'react';
import PlayerProfile from './components/PlayerProfile';
import MatchTable from './components/MatchTable';
import SubmitResultModal from './components/SubmitResultModal';
import { pairings as initialPairings, players } from './torneoData';
import GeneralStandings from './components/GeneralStandings';
import ProposeGameModal from './components/ProposeGameModal';
import BeautyPrizeView from './components/BeautyPrizeView';
import uploadIcon from './assets/align-to-top-svgrepo-com.svg';
import tournamentLogo from './assets/mancos.jpg';
import groupPic from './assets/group.jpg';
import groupLegendPic from './assets/groupwlegend.jpg'; 
import missUniversePic from './assets/missuniverse.jpg'; 
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase'; 

function App() {
  const getMexicoDate = () => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
  };

  const calculateCurrentRound = () => {
    const today = getMexicoDate();
    const schedule = [
      { name: 'Ronda 1', start: new Date('2026-04-20T00:00:00') },
      { name: 'Ronda 2', start: new Date('2026-04-27T00:00:00') },
      { name: 'Ronda 3', start: new Date('2026-05-04T00:00:00') },
      { name: 'Ronda 4', start: new Date('2026-05-11T00:00:00') },
      { name: 'Ronda 5', start: new Date('2026-05-18T00:00:00') },
      { name: 'Ronda 6', start: new Date('2026-05-25T00:00:00') },
      { name: 'Ronda 7', start: new Date('2026-06-01T00:00:00') },
      { name: 'Ronda 8', start: new Date('2026-06-08T00:00:00') },
      { name: 'Ronda 9', start: new Date('2026-06-15T00:00:00') },
    ];
    const current = schedule.reverse().find(r => today >= r.start);
    return current ? current.name : 'Ronda 1';
  };

  const getEasterEggImage = () => {
    const today = getMexicoDate();
    const ronda6Start = new Date('2026-05-25T00:00:00');
    const ronda9End = new Date('2026-06-22T00:00:00'); 
    return (today >= ronda6Start && today < ronda9End) ? groupLegendPic : groupPic;
  };

  const calculateBeautySubView = () => {
    const today = getMexicoDate();
    const ronda2Date = new Date('2026-06-23T00:00:00'); 
    const finalDate = new Date('2026-06-24T00:00:00');  

    if (today >= finalDate) return 'Final';
    if (today >= ronda2Date) return 'Ronda 2';
    return 'Ronda 1';
  };

  const [showInfo, setShowInfo] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentView, setCurrentView] = useState(calculateCurrentRound());
  const [beautySubView, setBeautySubView] = useState(calculateBeautySubView());
  const [tournamentPairings, setTournamentPairings] = useState(initialPairings);
  const [beautyGames, setBeautyGames] = useState([]); 
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [editingBeautyGame, setEditingBeautyGame] = useState(null);

  // LIMPIEZA DE DATOS (Fer Vásquez)
  const cleanOldNames = (data) => {
    const raw = JSON.stringify(data);
    const cleaned = raw.replace(/Fernando Vasquez/g, "Fer Vásquez");
    return JSON.parse(cleaned);
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "torneo", "resultados");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setTournamentPairings(cleanOldNames(docSnap.data()));
      else await setDoc(docRef, initialPairings);

      const beautyRef = doc(db, "torneo", "premioBelleza");
      const beautySnap = await getDoc(beautyRef);
      if (beautySnap.exists()) setBeautyGames(cleanOldNames(beautySnap.data().games || []));
      else await setDoc(beautyRef, { games: [] });
    };
    fetchData();
  }, []);

  const handleSaveResult = async (ronda, matchIndex, resultado, gameLink) => {
    const updatedPairings = { ...tournamentPairings };
    if (resultado === 'BORRAR') {
      updatedPairings[ronda][matchIndex].resultado = null;
      updatedPairings[ronda][matchIndex].gameLink = null;
    } else {
      updatedPairings[ronda][matchIndex].resultado = resultado;
      if (gameLink && gameLink.trim() !== '') updatedPairings[ronda][matchIndex].gameLink = gameLink.trim();
    }
    setTournamentPairings(updatedPairings);
    await setDoc(doc(db, "torneo", "resultados"), updatedPairings);
  };

  const closeProposeModal = () => {
    setShowProposeModal(false);
    setEditingBeautyGame(null);
  };

  // VALIDACIÓN DE POSTULACIONES
  const handleProposeGame = async (gameData) => {
    const otherGamesByProposer = editingBeautyGame 
      ? beautyGames.filter(g => g.proposer === gameData.proposer && g.link !== editingBeautyGame.link)
      : beautyGames.filter(g => g.proposer === gameData.proposer);

    let ownGamesProposed = 0;
    let othersGamesProposed = 0;

    otherGamesByProposer.forEach(g => {
      if (g.white === g.proposer || g.black === g.proposer) {
        ownGamesProposed++;
      } else {
        othersGamesProposed++;
      }
    });

    const isProposingOwnGame = (gameData.white === gameData.proposer || gameData.black === gameData.proposer);
    
    if (isProposingOwnGame && ownGamesProposed >= 1) {
      alert("Ya propusiste 1 partida tuya. No puedes proponer más.");
      return; 
    }
    if (!isProposingOwnGame && othersGamesProposed >= 1) {
      alert("Ya propusiste 1 partida de alguien más. No puedes proponer más.");
      return; 
    }

    let updatedGames;
    if (editingBeautyGame) {
      updatedGames = beautyGames.map(g => 
        g.link === editingBeautyGame.link 
          ? { ...gameData, likes: g.likes, round: g.round } 
          : g
      );
    } else {
      updatedGames = [...beautyGames, { ...gameData, likes: [], round: beautySubView }];
    }
    setBeautyGames(updatedGames);
    await setDoc(doc(db, "torneo", "premioBelleza"), { games: updatedGames });
    closeProposeModal(); 
  };

  const handleDeleteBeautyGame = async (gameToDelete) => {
    if (window.confirm("¿Estás seguro de que deseas borrar esta partida?")) {
      const updatedGames = beautyGames.filter(g => g.link !== gameToDelete.link);
      setBeautyGames(updatedGames);
      await setDoc(doc(db, "torneo", "premioBelleza"), { games: updatedGames });
    }
  };

  const openEditModal = (game) => {
    setEditingBeautyGame(game);
    setShowProposeModal(true);
  };

  // VALIDACIÓN DE VOTOS
  const handleLikeGame = async (gameObj, userInitial) => {
    const isLiking = !gameObj.likes.includes(userInitial);
    
    if (isLiking) {
      const playerNameByInitial = Object.keys(players).find(p => players[p].inicial === userInitial);
      const isWinner = (gameObj.result === '1 - 0' && gameObj.white === playerNameByInitial) ||
                       (gameObj.result === '0 - 1' && gameObj.black === playerNameByInitial);
      
      if (isWinner) {
        alert("¡Tramposo! No puedes votar por una partida en la que tú ganaste.");
        return;
      }

      const currentRoundGames = beautyGames.filter(g => g.round === beautySubView);
      const userLikesInRound = currentRoundGames.filter(g => g.likes.includes(userInitial)).length;
      
      let maxLikes = 3;
      if (beautySubView === 'Ronda 2') maxLikes = 2;
      if (beautySubView === 'Final') maxLikes = 1;

      if (userLikesInRound >= maxLikes) {
        alert(`Límite alcanzado: Solo puedes dar ${maxLikes} voto(s) en la ${beautySubView}. Si quieres cambiar tu voto, quítale el like a otra partida primero.`);
        return;
      }
    }

    const updatedGames = beautyGames.map(g => {
      if (g.link === gameObj.link) {
        if (g.likes.includes(userInitial)) {
          return { ...g, likes: g.likes.filter(initial => initial !== userInitial) };
        } else {
          return { ...g, likes: [...g.likes, userInitial] };
        }
      }
      return g;
    });
    setBeautyGames(updatedGames);
    await setDoc(doc(db, "torneo", "premioBelleza"), { games: updatedGames });
  };

  const getBeautyInstructions = () => {
    const today = getMexicoDate();
    const proposeDeadline = new Date('2026-06-22T23:59:59'); 
    
    if (beautySubView === 'Ronda 1') {
      if (today <= proposeDeadline) {
        return (
          <>
            Puedes proponer a lo más 1 victoria tuya y a lo más 1 victoria de alguien más.
            <br/>
            <span className="font-bold mt-1 inline-block text-white">Fecha límite: Lunes 22 de junio, 11:59 p.m.</span>
          </>
        );
      }
      return (
        <>
          Tienes 3 votos, no puedes votar por partidas que hayas ganado. Las partidas con 3 o más votos avanzan a la siguiente ronda.
          <br/>
          <span className="font-bold mt-1 inline-block text-white">Fecha límite es: Martes 23 de junio, 11:59 p.m.</span>
        </>
      );
    }
    if (beautySubView === 'Ronda 2') {
      return (
        <>
          Tienes 2 votos, las 2 partidas con más votos avanzan a la siguiente ronda.
          <br/>
          <span className="font-bold mt-1 inline-block text-white">Fecha límite es: Miércoles 24 de junio, 11:59 p.m.</span>
        </>
      );
    }
    return (
      <>
        Tienes solo 1 voto. Si ganaste una partida que está en la final, no puedes votar.
        <br/>
        <span className="font-bold mt-1 inline-block text-white">Fecha límite es: Jueves 25 de junio, 11:59 p.m.</span>
      </>
    );
  };

  const roundDates = {
    'Ronda 1': '20 al 26 de Abril',
    'Ronda 2': '27 de Abril al 03 de Mayo',
    'Ronda 3': '4 al 10 de Mayo',
    'Ronda 4': '11 al 17 de Mayo (Ronda conjunta)',
    'Ronda 5': '18 al 24 de Mayo',
    'Ronda 6': '25 al 31 de Mayo',
    'Ronda 7': '1 al 7 de Junio',
    'Ronda 8': '8 al 14 de Junio',
    'Ronda 9': '15 al 21 de Junio (Ronda conjunta)',
    'Tabla General': '',
    'Premio de Belleza': ''
  };

  const isBeautyView = currentView === 'Premio de Belleza';

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 p-2 md:p-6 font-sans">
      
      <div className="max-w-5xl mx-auto mb-10 flex flex-col items-center text-center">
        
        {/* CORRECCIÓN: Traslación artificial a la izquierda (-translate-x-4 md:-translate-x-6) SOLO en Premio de Belleza */}
       <div className={`flex items-center justify-center gap-4 mb-4 w-full ${isBeautyView ? 'relative translate-x-9 md:translate-x-0' : ''}`}>
          <img 
            src={isBeautyView ? missUniversePic : tournamentLogo} 
            alt="Logo" 
            onClick={!isBeautyView ? () => setShowEasterEgg(true) : undefined}
            className={`w-16 h-16 object-cover rounded-full border-2 ${isBeautyView ? 'border-pink-500/30' : 'border-gray-700'} shadow-lg shrink-0 ${!isBeautyView ? 'cursor-pointer' : 'cursor-default'}`}
          />
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight text-left leading-tight ${isBeautyView ? 'text-pink-300' : 'text-white'}`}>
            {isBeautyView ? 'Premio de Belleza' : <><span className="hidden sm:inline">Torneo de Mancos</span><span className="sm:hidden">Torneo de<br/> Mancos</span></>}
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setShowInfo(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
            <span className="text-blue-400 font-bold px-2 rounded-full border border-blue-400 text-sm">i</span> INFO
          </button>
        </div>
      </div>

      {showEasterEgg && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[100] p-4 cursor-default" onClick={() => setShowEasterEgg(false)}>
          <img src={getEasterEggImage()} alt="El grupo" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
            
            {!isBeautyView ? (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Reglamento del Torneo de Mancos</h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li><strong className="text-white">Ritmo de juego:</strong> 60 minutos + 30 segundos de incremento.</li>
                  <li><strong className="text-white">Sistema:</strong> Round Robin simple (una partida por semana).</li>
                  <li><strong className="text-white">Costo:</strong> Apuestas 100 varos por partida contra tu oponente cada ronda.</li>
                  <li><strong className="text-white">Premio de belleza:</strong> Aportación de 50 varos; el ganador se lleva 400.</li>
                  <li><strong className="text-white">Modalidad:</strong> Se recomienda presencial. Las rondas 4 y 9 serán en conjunto, el resto se acuerda con el rival.</li>
                  <li><strong className="text-white">Equipo:</strong> Lleva tablero y reloj o la asosiación de mancos te cortará la otra mano.</li>
                </ul>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Premio de Belleza</h2>
                <p className="text-sm text-pink-200 italic mb-4">Aquí premiaremos a la partida más besha de todo el torneo.</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong className="text-pink-300">Monto:</strong> El ganador de la votación se lleva 400 varos.</li>
                  <li><strong className="text-pink-300">Propuestas:</strong> Cada jugador puede proponer a lo más 1 partida suya y a lo más 1 de alguien más.</li>
                  <li><strong className="text-pink-300">Votaciones:</strong>
                    <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                      <li><strong className="text-white">Ronda 1:</strong> 3 votos. No votas por partidas ganadas tuyas. Las de 3+ votos avanzan.</li>
                      <li><strong className="text-white">Ronda 2:</strong> 2 votos. Las 2 con más votos avanzan a la Final.</li>
                      <li><strong className="text-white">Final:</strong> 1 voto. Si juegas la final y ganaste, no votas.</li>
                    </ul>
                  </li>
                </ul>
              </>
            )}

            <button onClick={() => setShowInfo(false)} className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto border-t border-gray-800 pt-6">
        
        {/* CORRECCIÓN: Párrafo original restaurado (flex-col md:flex-row) */}
        <p className="text-sm text-gray-400 mb-8 font-light leading-relaxed text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <span className="text-center md:text-right text-white md:whitespace-nowrap">
            {isBeautyView ? getBeautyInstructions() : 'El ganador sube el resultado y el árbitro (Ferny) verifica. Los resultados se publicarán en la Tabla General.'}
          </span>
          
          <span 
            onClick={() => isBeautyView ? openEditModal(null) : setShowSubmitModal(true)} 
            className={`cursor-pointer font-medium tracking-wide inline-flex items-center gap-1.5 transition-colors border p-2 rounded-lg shrink-0 ${isBeautyView ? 'text-pink-400 border-pink-700/30 hover:bg-pink-900/20' : 'text-blue-400 border-blue-700/50 hover:bg-blue-900/30'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 4h16"/><path d="M12 20V8"/><path d="m6 14 6-6 6 6"/>
            </svg>
            {isBeautyView ? 'PROPONER PARTIDA' : 'SUBIR RESULTADOS'}
          </span>
        </p>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start">
          
          <div className="flex flex-col gap-1 w-64">
            <div className="inline-block relative w-full">
              <label className="absolute -top-2.5 left-3 bg-[#121212] px-1 text-[10px] uppercase tracking-widest text-blue-400 z-10">Vista</label>
              <select value={currentView} onChange={(e) => setCurrentView(e.target.value)} className="w-full bg-transparent border border-blue-400/50 text-white p-3 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer relative z-0 text-sm">
                <option value="Tabla General" className="bg-[#1a1a1a]">Tabla General</option>
                {Object.keys(tournamentPairings).sort((a, b) => parseInt(a.replace('Ronda ', '')) - parseInt(b.replace('Ronda ', ''))).map(ronda => (
                  <option key={ronda} value={ronda} className="bg-[#1a1a1a]">{ronda}</option>
                ))}
                <option value="Premio de Belleza" className="bg-[#1a1a1a]">Premio de Belleza</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-400"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
            </div>
            <span className="text-xs text-gray-500 italic ml-1">{roundDates[currentView]}</span>
          </div>

          {isBeautyView && (
            <div className="flex flex-col gap-1 w-48">
              <div className="inline-block relative w-full">
                <label className="absolute -top-2.5 left-3 bg-[#121212] px-1 text-[10px] uppercase tracking-widest text-pink-400 z-10">Etapa</label>
                <select value={beautySubView} onChange={(e) => setBeautySubView(e.target.value)} className="w-full bg-transparent border border-pink-500/30 text-white p-3 rounded appearance-none focus:outline-none focus:border-pink-400 cursor-pointer relative z-0 text-sm">
                  <option value="Ronda 1" className="bg-[#1a1a1a]">Ronda 1</option>
                  <option value="Ronda 2" className="bg-[#1a1a1a]">Ronda 2</option>
                  <option value="Final" className="bg-[#1a1a1a]">Final</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pink-400"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
              </div>
              <span className="text-xs text-transparent select-none">&nbsp;</span>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto"> {/* Este asegura que nada se pase del ancho del header */}
          <div className={`mt-4 ${!isBeautyView ? 'bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl overflow-hidden' : 'px-2 md:px-0'}`}>
            {currentView === 'Premio de Belleza' ? (
              <BeautyPrizeView 
                games={beautyGames} 
                currentSubView={beautySubView} 
                players={players} 
                onLike={handleLikeGame} 
                onEdit={openEditModal} 
                onDelete={handleDeleteBeautyGame} 
              />
            ) : currentView === 'Tabla General' ? (
              <GeneralStandings pairings={tournamentPairings} players={players} onPlayerClick={(player) => setSelectedPlayer(player)} onLogoClick={() => setShowEasterEgg(true)} />
            ) : (
              <MatchTable currentPairings={tournamentPairings[currentView]} players={players} onPlayerClick={(player) => setSelectedPlayer(player)} />
            )}
          </div>
        </div>
      </div>

      <PlayerProfile player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      
      <SubmitResultModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} currentRound={currentView} pairings={tournamentPairings} onSave={handleSaveResult} />
      
      <ProposeGameModal isOpen={showProposeModal} onClose={closeProposeModal} onSave={handleProposeGame} players={players} editingGame={editingBeautyGame} />
      
    </div>
  );
}

export default App;