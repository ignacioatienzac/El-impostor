import React, { useState } from 'react';
import { GameMode } from '../types';
import { Button } from './Button';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';
import { UserPlus, UserMinus, Users, ShieldAlert, Shield } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (names: string[], mode: GameMode) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(MIN_PLAYERS);
  const [names, setNames] = useState<string[]>(Array(MIN_PLAYERS).fill(''));
  const [mode, setMode] = useState<GameMode>(GameMode.SIMILAR);

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
    onStartGame(finalNames, mode);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-6 animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
          El Intruso
        </h1>
        <p className="text-slate-400 text-sm">Configura la partida para comenzar</p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-200">Modalidad de Juego</h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setMode(GameMode.SIMILAR)}
            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
              mode === GameMode.SIMILAR
                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
            }`}
          >
            <div className={`p-2 rounded-full ${mode === GameMode.SIMILAR ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Palabra Similar</div>
              <div className="text-xs opacity-70">El intruso tiene una palabra parecida. Nadie sabe quién es.</div>
            </div>
          </button>

          <button
            onClick={() => setMode(GameMode.NO_SIMILAR)}
            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
              mode === GameMode.NO_SIMILAR
                ? 'border-purple-500 bg-purple-500/10 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
            }`}
          >
             <div className={`p-2 rounded-full ${mode === GameMode.NO_SIMILAR ? 'bg-purple-500' : 'bg-slate-700'}`}>
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Sin Palabra</div>
              <div className="text-xs opacity-70">El intruso ve "INTRUSO". Solo él sabe quién es.</div>
            </div>
          </button>
        </div>
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