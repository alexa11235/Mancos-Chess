import { useState } from 'react';
import PlayerProfile from './components/PlayerProfile';
import MatchTable from './components/MatchTable';
import SubmitResultModal from './components/SubmitResultModal';
import { pairings as initialPairings, players } from './torneoData';
import GeneralStandings from './components/GeneralStandings';
// Importamos el ícono SVG que tenías
import uploadIcon from './assets/align-to-top-svgrepo-com.svg';
// NUEVO: Importamos el logo del torneo
import tournamentLogo from './assets/mancos.jpg';
import { useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Tu nuevo archivo de conexión

function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentView, setCurrentView] = useState('Ronda 1');
  const [tournamentPairings, setTournamentPairings] = useState(initialPairings);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // NUEVO: Cargar datos desde Firebase al iniciar
  useEffect(() => {
    const fetchPairings = async () => {
      // Apuntamos a un documento llamado "resultados" dentro de la colección "torneo"
      const docRef = doc(db, "torneo", "resultados");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Si ya hay datos en la nube, los usamos
        setTournamentPairings(docSnap.data());
      } else {
        // Si la base de datos está vacía (primera vez), subimos tus datos locales iniciales
        await setDoc(docRef, initialPairings);
      }
    };
    fetchPairings();
  }, []);

  // Función que guarda el resultado en la tabla Y EN LA NUBE
  // Función que guarda (o borra) el resultado en la tabla Y EN LA NUBE
  const handleSaveResult = async (ronda, matchIndex, resultado, gameLink) => {
    const updatedPairings = { ...tournamentPairings };
    
    // Si la orden es borrar, limpiamos los datos
    if (resultado === 'BORRAR') {
      updatedPairings[ronda][matchIndex].resultado = null;
      updatedPairings[ronda][matchIndex].gameLink = null;
    } else {
      // Si es un resultado normal, lo guardamos
      updatedPairings[ronda][matchIndex].resultado = resultado;
      if (gameLink && gameLink.trim() !== '') {
        updatedPairings[ronda][matchIndex].gameLink = gameLink.trim();
      }
    }
    
    // Actualizamos la pantalla de inmediato
    setTournamentPairings(updatedPairings);

    // Guardamos el cambio (o el borrado) en Firebase
    try {
      const docRef = doc(db, "torneo", "resultados");
      await setDoc(docRef, updatedPairings);
      console.log("¡Base de datos actualizada!");
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
    }
  };

  const roundDates = {
    'Ronda 1': '20 al 26 de Abril',
    'Ronda 2': '27 de Abril al 03 de Mayo',
    'Ronda 3': '4 al 10 de Mayo',
    'Ronda 4': '11 al 17 de Mayo',
    'Ronda 5': '18 al 24 de Mayo (Ronda conjunta)',
    'Ronda 6': '25 al 31 de Mayo',
    'Ronda 7': '1 al 7 de Junio',
    'Ronda 8': '8 al 14 de Junio',
    'Ronda 9': '15 al 21 de Junio (Ronda conjunta)',
    'Tabla General': 'Tabla general de posiciones'
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 p-2 md:p-6 font-sans">
      
      {/* HEADER CENTRADO CON LOGO */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col items-center text-center">
        {/* Aquí forzamos el centrado (justify-center) y dejamos el logo grande en celulares */}
        <div className="flex items-center justify-center gap-4 mb-4 w-full">
          <img 
            src={tournamentLogo} 
            alt="Logo Torneo de Mancos" 
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-700 shadow-lg shrink-0"
          />
          {/* Añadí un salto de línea (<br/>) oculto en escritorio pero visible en móvil para que el texto no desborde */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-left leading-tight">
            Torneo de<br className="block sm:hidden" /> Mancos
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
          >
            <span className="text-blue-400 font-bold px-2 rounded-full border border-blue-400 text-sm">i</span>
            INFO
          </button>
        </div>
      </div>

      {/* MODAL DE INFO */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-4">Reglamento del Torneo de Mancos</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><strong className="text-white">Ritmo de juego:</strong> 60 minutos + 30 segundos de incremento.</li>
              <li><strong className="text-white">Sistema:</strong> Round Robin simple (una partida por semana).</li>
              <li><strong className="text-white">Costo:</strong> Apuestas 100 varos por partida contra tu oponente cada ronda.</li>
              <li><strong className="text-white">Partida Brillante:</strong> Aportación de 50 varos; el ganador se lleva 450.</li>
              <li><strong className="text-white">Modalidad:</strong> Se recomienda presencial. Las rondas 5 y 9 serán en conjunto, el resto se acuerda con el rival.</li>
              <li><strong className="text-white">Equipo:</strong> Lleva tablero y reloj o la asosiación de mancos te cortará la otra mano.</li>
            </ul>
            <button 
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* CONTROLES Y TABLA DINÁMICA */}
      <div className="max-w-5xl mx-auto border-t border-gray-800 pt-6">
        
        {/* Subida de resultados dinámica */}
        <p className="text-sm text-gray-400 mb-8 font-light leading-relaxed text-center">
          El ganador sube el resultado y el árbitro (Ferny) verifica. Los resultados se publicarán en la Tabla General. 
          <span 
            onClick={() => setShowSubmitModal(true)} 
            className="ml-3 text-blue-400 cursor-pointer hover:text-blue-300 font-medium tracking-wide inline-flex items-center gap-1.5 align-middle transition-colors"
          >
            {/* Ícono de flecha hacia la barra superior que hereda el color del texto */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 4h16"/>
              <path d="M12 20V8"/>
              <path d="m6 14 6-6 6 6"/>
            </svg>
            SUBIR RESULTADOS
          </span>
        </p>

        <div className="mb-8 flex flex-col gap-2">
          <div className="inline-block relative w-64">
            <label className="absolute -top-2.5 left-3 bg-[#121212] px-1 text-[10px] uppercase tracking-widest text-blue-400 z-10">
              Vista
            </label>
            <select 
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value)}
              className="w-full bg-transparent border border-blue-400/50 text-white p-3 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer relative z-0 text-sm"
            >
              <option value="Tabla General" className="bg-[#1a1a1a]">Tabla General</option>
              {Object.keys(tournamentPairings)
                // Esto fuerza a Javascript a extraer el número de la palabra "Ronda 1" y ordenarlos matemáticamente
                .sort((a, b) => parseInt(a.replace('Ronda ', '')) - parseInt(b.replace('Ronda ', '')))
                .map(ronda => (
                <option key={ronda} value={ronda} className="bg-[#1a1a1a]">{ronda}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-400">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <span className="text-xs text-gray-500 italic ml-1">
            {roundDates[currentView]}
          </span>
        </div>

        {/* RENDERIZADO CONDICIONAL DE LA TABLA */}
        <div className="mt-4 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl overflow-hidden">
          {currentView === 'Tabla General' ? (
            // Aquí llamamos al nuevo componente de posiciones
            <GeneralStandings 
              pairings={tournamentPairings} 
              players={players} 
              onPlayerClick={(player) => setSelectedPlayer(player)}
            />
          ) : (
            // Esta es tu MatchTable que ya tenías
            <MatchTable 
              currentPairings={tournamentPairings[currentView]} 
              players={players}
              onPlayerClick={(player) => setSelectedPlayer(player)}
            />
          )}
        </div>

      </div>

      <PlayerProfile 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
      
      {/* MODAL PARA SUBIR RESULTADOS */}
      <SubmitResultModal 
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        currentRound={currentView}
        pairings={tournamentPairings}
        onSave={handleSaveResult}
      />

    </div>
  );
}

export default App;