'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

interface CameraViewProps {
  onFeedback: (feedback: any) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onFeedback }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const capture = useCallback(async () => {
    if (webcamRef.current && !isAnalyzing) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          setIsAnalyzing(true);
          const response = await axios.post('http://localhost:8000/analyze-frame', {
            image: imageSrc,
          });
          onFeedback(response.data);
        } catch (error) {
          console.error('Error sending frame to backend:', error);
          onFeedback({ error: 'Erro de conexão com o servidor' });
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  }, [onFeedback, isAnalyzing]);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 1000); // Send frame every second for real-time feel
    return () => clearInterval(interval);
  }, [capture]);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black shadow-2xl">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'environment',
          width: 1280,
          height: 720,
        }}
        className="w-full h-full object-cover"
      />
      {/* Guided Overlay Silhouette */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-80 border-4 border-white/50 border-dashed rounded-lg flex items-center justify-center">
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
            Enquadre o Padrão Aqui
          </span>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
