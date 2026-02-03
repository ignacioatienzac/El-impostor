import React from 'react';
import { Button } from './Button';
import { Player } from '../types';
import { PlayCircle, RotateCcw } from 'lucide-react';

interface SummaryScreenProps {
  startingPlayerName: string;
  onReset: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ startingPlayerName, onReset }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col min-h-[80vh] justify-center items-center gap-8 animate-fade-in text-center">
      
      <div className="flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50 text-green-400">
           <PlayCircle className="w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-white">¡Todo listo!</h2>
        <p className="text-slate-400">
          Todos han visto sus palabras. Ahora deben debatir para encontrar al intruso.
        </p>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full shadow-lg">
        <p className="text-slate-500 text-sm uppercase font-bold tracking-widest mb-2">Empieza hablando</p>
        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          {startingPlayerName}
        </h3>
      </div>

      <div className="mt-8 w-full">
        <Button onClick={onReset} variant="secondary" fullWidth className="flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Nueva Partida
        </Button>
      </div>
    </div>
  );
};