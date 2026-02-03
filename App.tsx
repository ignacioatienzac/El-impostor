import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { GameMode, GamePhase, GameState, Player, WordPair } from './types';
import { VOCABULARY } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    mode: GameMode.SIMILAR,
    players: [],
    currentPlayerIndex: 0,
    wordPair: null,
    startingPlayerIndex: 0
  });

  const startGame = (names: string[], mode: GameMode) => {
    // 1. Select a random word pair
    const randomPairIndex = Math.floor(Math.random() * VOCABULARY.length);
    const selectedPair = VOCABULARY[randomPairIndex];

    // 2. Select a random impostor
    const impostorIndex = Math.floor(Math.random() * names.length);

    // 3. Select a random starting player
    const startIndex = Math.floor(Math.random() * names.length);

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
        // In NO_SIMILAR mode: Impostor gets "INTRUSO", others get 'group' word
        assignedWord = isImpostor ? 'INTRUSO' : selectedPair.group;
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

      <main className="w-full max-w-lg min-h-screen flex flex-col">
        {gameState.phase === GamePhase.SETUP && (
          <SetupScreen onStartGame={startGame} />
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
    </div>
  );
};

export default App;