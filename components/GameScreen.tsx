import React, { useState } from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { Eye, EyeOff, User } from 'lucide-react';

interface GameScreenProps {
  player: Player;
  currentPlayerIndex: number;
  totalPlayers: number;
  onNext: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  player, 
  currentPlayerIndex, 
  totalPlayers, 
  onNext 
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsRevealed(false);
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col min-h-[80vh] justify-between animate-fade-in">
      <div className="flex flex-col items-center gap-2 mt-4">
        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-700">
          Turno {currentPlayerIndex + 1} de {totalPlayers}
        </span>
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-4">
           <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white text-center">
          Hola, <span className="text-indigo-400">{player.name}</span>
        </h2>
        <p className="text-slate-400 text-center text-sm max-w-xs">
          Pasa el móvil a este jugador. Asegúrate de que nadie más esté mirando la pantalla.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center py-8">
        {!isRevealed ? (
          <button 
            onClick={handleReveal}
            className="w-full aspect-[4/3] bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-slate-800 hover:border-indigo-500/50 transition-all group cursor-pointer"
          >
            <Eye className="w-12 h-12 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="text-slate-400 font-semibold group-hover:text-slate-200">Toca para ver tu palabra</span>
          </button>
        ) : (
          <div className="w-full aspect-[4/3] bg-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-2xl relative overflow-hidden animate-flip-in">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-2">Tu palabra secreta</p>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 text-center px-4 leading-tight break-words">
              {player.word}
            </h3>
            <div className="absolute bottom-4 right-4 opacity-10">
               <EyeOff className="w-24 h-24 text-slate-900" />
            </div>
          </div>
        )}
      </div>

      <div className="w-full space-y-4">
        {isRevealed && (
          <div className="text-center text-yellow-500 text-sm font-medium animate-pulse">
            Memorízala y ocúltala rápido
          </div>
        )}
        <Button 
          fullWidth 
          onClick={handleNext}
          disabled={!isRevealed}
          variant={isRevealed ? 'primary' : 'secondary'}
          className="text-lg"
        >
          {currentPlayerIndex + 1 === totalPlayers ? 'Terminar Reparto' : 'Siguiente Jugador'}
        </Button>
      </div>
    </div>
  );
};