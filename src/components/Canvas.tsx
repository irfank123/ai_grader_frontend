'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from 'lucide-react'
import jsPDF from 'jspdf'

const Canvas: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasOffset, setCanvasOffset] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top + canvasOffset
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setCanvasOffset(0)
  }

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0 && canvasOffset < 1000) {  // Limit scrolling to 1000px
      setCanvasOffset(prev => prev + 20)
    } else if (e.deltaY < 0 && canvasOffset > 0) {
      setCanvasOffset(prev => prev - 20)
    }
  }

  const generatePDF = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 10, 10)
      pdf.save('solution.pdf')
    }
  }

  const toggleMicrophone = () => {
    setIsMicOn(!isMicOn)
    // Here you would typically implement the actual microphone logic
    console.log(isMicOn ? 'Microphone turned off' : 'Microphone turned on')
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Your Solution:</h2>
      <div 
        className="border border-gray-300 rounded-lg overflow-hidden" 
        style={{height: '400px', overflowY: 'auto'}}
        onWheel={handleScroll}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={1400}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          className="w-full"
          style={{marginTop: `-${canvasOffset}px`}}
        />
      </div>
      <div className="mt-2 flex gap-2">
        <Button 
          onClick={clearCanvas} 
          variant="outline"
          className="flex-1"
        >
          Clear Canvas
        </Button>
        <Button 
          onClick={generatePDF} 
          variant="outline"
          className="flex-1"
        >
          Generate PDF
        </Button>
        <Button 
          onClick={toggleMicrophone} 
          variant="outline"
          className="flex-1"
        >
          {isMicOn ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
          {isMicOn ? 'Turn Off Mic' : 'Turn On Mic'}
        </Button>
      </div>
    </div>
  )
}

export default Canvas