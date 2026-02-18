import React, { useState } from 'react';
import { GameMode, WordSource } from '../types';
import { Button } from './Button';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';
import { UserPlus, UserMinus, Users, ShieldAlert, Shield, BookOpen, Edit3 } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (names: string[], mode: GameMode, wordSource: WordSource, customWords?: { group: string; impostor: string }) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(MIN_PLAYERS);
  const [names, setNames] = useState<string[]>(Array(MIN_PLAYERS).fill(''));
  const [mode, setMode] = useState<GameMode>(GameMode.SIMILAR);
  const [wordSource, setWordSource] = useState<WordSource>(WordSource.PRESET);
  const [customGroupWord, setCustomGroupWord] = useState<string>('');
  const [customImpostorWord, setCustomImpostorWord] = useState<string>('');

  const handlePlayerCountChange = (delta: number) => {
    const newCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, playerCount + delta));
    setPlayerCount(newCount);
    
    setNames(prev => {
      if (newCount > prev.length) {
        return [...prev, ''];
      } else {
        return prev.slice(0, newCount);
      }
    });
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleStart = () => {
    // Fill empty names with defaults like "Jugador 1"
    const finalNames = names.map((name, i) => name.trim() || `Jugador ${i + 1}`);
    
    if (wordSource === WordSource.CUSTOM) {
      const customWords = {
        group: customGroupWord.trim() || 'Palabra',
        impostor: mode === GameMode.SIMILAR ? (customImpostorWord.trim() || 'Palabra Similar') : ''
      };
      onStartGame(finalNames, mode, wordSource, customWords);
    } else {
      onStartGame(finalNames, mode, wordSource);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-6 animate-fade-in">
      <div className="text-center mb-4">
        <h1 style={{ fontWeight: 800, letterSpacing: '-0.05em', background: 'linear-gradient(90deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} className="text-4xl mb-2">
          El Impostor
        </h1>
        <p className="text-slate-400 text-sm">Configura la partida para comenzar</p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-200">Modalidad de Juego</h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setMode(GameMode.SIMILAR)}
            className={`card-select p-4 flex items-center gap-4 text-left w-full ${mode === GameMode.SIMILAR ? 'active text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className={`p-2 rounded-full flex-shrink-0 ${mode === GameMode.SIMILAR ? 'bg-violet-600' : 'bg-slate-700'}`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Palabra Similar</div>
              <div className="text-xs opacity-70">El impostor tiene una palabra parecida. Nadie sabe quién es.</div>
            </div>
          </button>

          <button
            onClick={() => setMode(GameMode.NO_SIMILAR)}
            className={`card-select p-4 flex items-center gap-4 text-left w-full ${mode === GameMode.NO_SIMILAR ? 'active text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className={`p-2 rounded-full flex-shrink-0 ${mode === GameMode.NO_SIMILAR ? 'bg-violet-600' : 'bg-slate-700'}`}>
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Sin Palabra</div>
              <div className="text-xs opacity-70">El impostor ve "IMPOSTOR". Solo él sabe quién es.</div>
            </div>
          </button>
        </div>
      </div>

      {/* Word Source Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-200">Palabras</h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setWordSource(WordSource.PRESET)}
            className={`card-select p-4 flex items-center gap-4 text-left w-full ${wordSource === WordSource.PRESET ? 'active text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className={`p-2 rounded-full flex-shrink-0 ${wordSource === WordSource.PRESET ? 'bg-violet-600' : 'bg-slate-700'}`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Palabras Predeterminadas</div>
              <div className="text-xs opacity-70">Usa las palabras del juego automáticamente.</div>
            </div>
          </button>

          <button
            onClick={() => setWordSource(WordSource.CUSTOM)}
            className={`card-select p-4 flex items-center gap-4 text-left w-full ${wordSource === WordSource.CUSTOM ? 'active text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <div className={`p-2 rounded-full flex-shrink-0 ${wordSource === WordSource.CUSTOM ? 'bg-violet-600' : 'bg-slate-700'}`}>
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Palabras Personalizadas</div>
              <div className="text-xs opacity-70">Escribe tus propias palabras para este juego.</div>
            </div>
          </button>
        </div>

        {/* Custom Word Inputs */}
        {wordSource === WordSource.CUSTOM && (
          <div className="space-y-3 mt-4 animate-fade-in">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Palabra para la mayoría
                </label>
                <input
                  type="text"
                  placeholder="Ej: Gato"
                  value={customGroupWord}
                  onChange={(e) => setCustomGroupWord(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                />
              </div>
              
              {mode === GameMode.SIMILAR && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Palabra para el impostor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Perro"
                    value={customImpostorWord}
                    onChange={(e) => setCustomImpostorWord(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              )}

              {mode === GameMode.NO_SIMILAR && (
                <p className="text-xs text-slate-400 italic">
                  El impostor verá "IMPOSTOR" automáticamente.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Player Count */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-200">Jugadores</h2>
        <div className="flex items-center justify-between bg-slate-800 p-2 rounded-xl border border-slate-700">
          <button 
            onClick={() => handlePlayerCountChange(-1)}
            disabled={playerCount <= MIN_PLAYERS}
            className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-30 transition-colors"
          >
            <UserMinus className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">{playerCount}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
          </div>

          <button 
            onClick={() => handlePlayerCountChange(1)}
            disabled={playerCount >= MAX_PLAYERS}
            className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-30 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Player Names */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {names.map((name, index) => (
          <div key={index} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              {index + 1}
            </div>
            <input
              type="text"
              placeholder={`Nombre Jugador ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 pb-8">
        <Button fullWidth onClick={handleStart} className="text-lg">
          Comenzar Partida
        </Button>
      </div>
    </div>
  );
};