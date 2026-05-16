'use client';

import React, { useState } from 'react';
import CameraView from '@/components/CameraView';
import FeedbackCard from '@/components/FeedbackCard';
import { motion } from 'framer-motion';
import { Droplets, Info, History, Settings, ChevronLeft, HelpCircle } from 'lucide-react';

export default function Home() {
  const [feedback, setFeedback] = useState<any>(null);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="px-6 py-6 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Vistoria Digital</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Saneago Tech</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Progress Stepper */}
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-blue-500" />
          <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
          <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
        </div>

        {/* Introduction */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Foto do Padrão</h2>
          <p className="text-slate-500 leading-relaxed text-sm">
            Para sua segurança e agilidade, nossa tecnologia valida a instalação em tempo real.
          </p>
        </div>

        {/* Camera Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white"
        >
          <CameraView onFeedback={setFeedback} />
          
          {/* Subtle info tag on camera */}
          <div className="absolute top-4 left-4 right-4 flex justify-center">
            <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/20">
              <p className="text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Análise em Tempo Real
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <FeedbackCard data={feedback} />

        {/* Action Area */}
        <div className="space-y-4 pt-2">
          <button 
            disabled={!feedback || feedback.status !== 'approved'}
            className={`w-full py-5 rounded-[2rem] font-bold text-lg transition-all duration-300 ${
              feedback?.status === 'approved'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {feedback?.status === 'approved' ? 'Tirar Foto e Continuar' : 'Aguardando Posição...'}
          </button>
          
          <p className="text-center text-[11px] text-slate-400 px-8 leading-normal">
            Ao continuar, você concorda com a análise digital da imagem para fins de vistoria técnica.
          </p>
        </div>
      </div>
    </main>
  );
}
