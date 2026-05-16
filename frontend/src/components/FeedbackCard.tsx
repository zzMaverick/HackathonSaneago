'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Camera, HelpCircle, Sparkles } from 'lucide-react';

interface FeedbackCardProps {
  data: any;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ data }) => {
  if (data?.error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center gap-4 text-red-700"
      >
        <AlertCircle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Ops! Algo deu errado</h3>
          <p className="text-sm">{data.error}</p>
        </div>
      </motion.div>
    );
  }

  if (!data) return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
    >
      <div className="bg-blue-50 p-3 rounded-2xl">
        <Camera className="w-6 h-6 text-blue-500 animate-pulse" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">Vamos começar?</h3>
        <p className="text-sm text-gray-500 text-pretty">Posicione o padrão no centro da tela.</p>
      </div>
    </motion.div>
  );

  const { status, quality, feedback, detections } = data;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div 
          key={status}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`p-6 rounded-3xl shadow-sm border transition-colors duration-500 ${
            status === 'approved' 
              ? 'bg-green-50 border-green-100' 
              : 'bg-amber-50 border-amber-100'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${
              status === 'approved' ? 'bg-green-500' : 'bg-amber-500'
            }`}>
              {status === 'approved' ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${
                status === 'approved' ? 'text-green-900' : 'text-amber-900'
              }`}>
                {status === 'approved' ? 'Tudo certinho!' : 'Quase lá...'}
              </h3>
              <div className="space-y-1 mt-1">
                {feedback.map((msg: string, i: number) => (
                  <p key={i} className={`text-sm ${
                    status === 'approved' ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Qualidade</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Iluminação</span>
              <div className={`h-1.5 w-12 rounded-full overflow-hidden bg-gray-200`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: quality.is_dark ? '30%' : '100%' }}
                  className={`h-full ${quality.is_dark ? 'bg-amber-500' : 'bg-green-500'}`}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Foco</span>
              <div className={`h-1.5 w-12 rounded-full overflow-hidden bg-gray-200`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: quality.is_blurry ? '30%' : '100%' }}
                  className={`h-full ${quality.is_blurry ? 'bg-amber-500' : 'bg-green-500'}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identificamos</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {detections && detections.length > 0 ? (
              detections.map((d: any, i: number) => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={i} 
                  className="px-3 py-1 bg-white text-gray-700 text-[11px] font-medium rounded-full border border-gray-100 shadow-sm"
                >
                  {d.label}
                </motion.span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">Analisando...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
