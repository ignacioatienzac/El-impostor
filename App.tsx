import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { GameMode, GamePhase, GameState, Player, WordPair, WordSource } from './types';
import { VOCABULARY } from './constants';
import { X } from 'lucide-react';

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick one random element from an array using Fisher-Yates derived index */
function pickRandom<T>(arr: T[]): T {
  return shuffle(arr)[0];
}

const App: React.FC = () => {
  const [showWordList, setShowWordList] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    mode: GameMode.SIMILAR,
    players: [],
    currentPlayerIndex: 0,
    wordPair: null,
    startingPlayerIndex: 0
  });

  const startGame = (names: string[], mode: GameMode, wordSource: WordSource, customWords?: { group: string; impostor: string }) => {
    // 1. Select or use word pair
    let selectedPair: WordPair;

    if (wordSource === WordSource.CUSTOM && customWords) {
      selectedPair = { group: customWords.group, impostor: customWords.impostor };
    } else {
      // Shuffle the full vocabulary and pick the first entry
      selectedPair = pickRandom(VOCABULARY);
    }

    // 2. Shuffle all player indices and pick the first as impostor
    const shuffledIndices = shuffle(names.map((_, i) => i));
    const impostorIndex = shuffledIndices[0];

    // 3. Pick a random starting player (different shuffle pass)
    const startIndex = shuffle(names.map((_, i) => i))[0];

    // 4. Create player objects with assigned words
    const newPlayers: Player[] = names.map((name, index) => {
      const isImpostor = index === impostorIndex;
      let assignedWord = '';

      if (mode === GameMode.SIMILAR) {
        // In SIMILAR mode: Impostor gets the 'impostor' word, others get 'group' word
        // Note: We randomise which word is "Group" and which is "Impostor" to prevent pattern learning
        // if the vocabulary list has a predictable order. But usually Group vs Impostor is enough.
        assignedWord = isImpostor ? selectedPair.impostor : selectedPair.group;
      } else {
        // In NO_SIMILAR mode: Impostor gets "IMPOSTOR", others get 'group' word
        assignedWord = isImpostor ? 'IMPOSTOR' : selectedPair.group;
      }

      return {
        id: `player-${index}`,
        name,
        isImpostor,
        word: assignedWord
      };
    });

    setGameState({
      phase: GamePhase.PLAYING,
      mode,
      players: newPlayers,
      currentPlayerIndex: 0,
      wordPair: selectedPair,
      startingPlayerIndex: startIndex
    });
  };

  const handleNextPlayer = () => {
    const nextIndex = gameState.currentPlayerIndex + 1;
    if (nextIndex >= gameState.players.length) {
      setGameState(prev => ({ ...prev, phase: GamePhase.SUMMARY }));
    } else {
      setGameState(prev => ({ ...prev, currentPlayerIndex: nextIndex }));
    }
  };

  const handleReset = () => {
    setGameState({
      phase: GamePhase.SETUP,
      mode: GameMode.SIMILAR,
      players: [],
      currentPlayerIndex: 0,
      wordPair: null,
      startingPlayerIndex: 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Word List Modal — rendered via portal directly on body to escape any stacking context */}
      {showWordList && createPortal(
        <div
          onClick={() => setShowWordList(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '28rem',
              background: 'var(--card-bg)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              display: 'flex', flexDirection: 'column',
              height: '80vh'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
              <h2 style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>Todas las palabras ({VOCABULARY.length})</h2>
              <button onClick={() => setShowWordList(false)} style={{ color: '#94a3b8', lineHeight: 1 }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '0.75rem 1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>Mayoría</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>Impostor</span>
              </div>
              {VOCABULARY.map((pair, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>{pair.group}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>{pair.impostor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      <main className="w-full max-w-lg min-h-screen flex flex-col">
        {gameState.phase === GamePhase.SETUP && (
          <SetupScreen onStartGame={startGame} onShowWordList={() => setShowWordList(true)} />
        )}

        {gameState.phase === GamePhase.PLAYING && gameState.players.length > 0 && (
          <GameScreen 
            player={gameState.players[gameState.currentPlayerIndex]}
            currentPlayerIndex={gameState.currentPlayerIndex}
            totalPlayers={gameState.players.length}
            onNext={handleNextPlayer}
          />
        )}

        {gameState.phase === GamePhase.SUMMARY && (
          <SummaryScreen 
            startingPlayerName={gameState.players[gameState.startingPlayerIndex].name}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="site-footer">
        <span className="footer-brand">SpanishwithIgnacio</span>
        <div className="footer-links">
          <a
            href="https://www.instagram.com/ignacio_recursosele/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            @ignacio_recursosele
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;