'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import p5Types from 'p5';

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [buttonText, setButtonText] = useState("Next Section");
  const p5InstanceRef = useRef<p5Types | null>(null);
  const recognitionRef = useRef<any>(null);

  const preventScroll = useCallback((e: TouchEvent) => {
    if (isDrawing) {
      e.preventDefault();
    }
  }, [isDrawing]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.touchAction = 'none';
    }

    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(prevTranscript => prevTranscript + ' ' + (finalTranscript || interimTranscript));
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          // Restart recognition if no speech is detected
          recognitionRef.current.stop();
        }
      };
    }

    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isDrawing, preventScroll, isRecording]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5InstanceRef.current = p5;
    const canvasWidth = canvasParentRef.clientWidth * 2;
    const canvasHeight = 500;

    const canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasParentRef);
    canvasRef.current = canvas.elt;
    p5.background(255);

    p5.noFill();
    p5.strokeWeight(4);
    p5.stroke(0);
  };

  const draw = (p5: p5Types) => {
    if (isDrawing) {
      const halfWidth = p5.width / 2;
      const adjustedMouseX = p5.mouseX - (currentSection * halfWidth);
      const adjustedPMouseX = p5.pmouseX - (currentSection * halfWidth);
      
      if (adjustedMouseX >= 0 && adjustedMouseX < halfWidth) {
        p5.line(
          adjustedPMouseX + (currentSection * halfWidth), 
          p5.pmouseY, 
          adjustedMouseX + (currentSection * halfWidth), 
          p5.mouseY
        );
      }
    }
  };

  const mousePressed = (p5: p5Types) => {
    const halfWidth = p5.width / 2;
    const adjustedMouseX = p5.mouseX - (currentSection * halfWidth);
    
    if (adjustedMouseX >= 0 && adjustedMouseX < halfWidth) {
      setIsDrawing(true);
    }
  };

  const mouseReleased = () => {
    setIsDrawing(false);
  };

  const touchStarted = (p5: p5Types) => {
    const halfWidth = p5.width / 2;
    if (p5.touches && p5.touches.length > 0) {
      const touch = p5.touches[0] as p5Types.Vector;
      const adjustedTouchX = touch.x - (currentSection * halfWidth);
      
      if (adjustedTouchX >= 0 && adjustedTouchX < halfWidth) {
        setIsDrawing(true);
      }
    }
    return false;
  };

  const touchEnded = () => {
    setIsDrawing(false);
    return false;
  };

  const switchSection = () => {
    const newSection = (currentSection + 1) % 2;
    setCurrentSection(newSection);
    setButtonText((prev) => prev === "Next Section" ? "Prev Section" : "Next Section");

    if (containerRef.current) {
      containerRef.current.scrollLeft = newSection * (containerRef.current.clientWidth);
    }
  };

  const clearCanvas = () => {
    if (p5InstanceRef.current) {
      const p5 = p5InstanceRef.current;
      const halfWidth = p5.width / 2;
      p5.fill(255);
      p5.noStroke();
      p5.rect(currentSection * halfWidth, 0, halfWidth, p5.height);
      p5.noFill();
      p5.stroke(0);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transcript.txt';
      link.click();
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'canvas_sections.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveAll = () => {
    downloadImage();
    saveTranscript();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div
        ref={containerRef}
        className="w-full border border-gray-300 rounded-lg overflow-hidden"
        style={{ height: '500px' }}
      >
        <Sketch 
          setup={setup} 
          draw={draw}
          mousePressed={mousePressed}
          mouseReleased={mouseReleased}
          touchStarted={touchStarted}
          touchEnded={touchEnded}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <Button onClick={switchSection} variant="secondary">
          {buttonText}
        </Button>
        <Button onClick={clearCanvas} variant="destructive">
          Clear Canvas
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "outline" : "default"}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Button onClick={saveAll} variant="default">
          Save All
        </Button>
      </div>
      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded w-full">
          <h3 className="font-bold mb-2">Transcript:</h3>
          <p className="whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
}