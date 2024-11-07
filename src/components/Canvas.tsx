'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from 'lucide-react'
import jsPDF from 'jspdf'

const Canvas: React.FC = () => {
  // state for controlling microphone status
  const [isMicOn, setIsMicOn] = useState(false)
  // reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // state to track if user is currently drawing
  const [isDrawing, setIsDrawing] = useState(false)
  // state for offset value for scrolling the canvas
  const [canvasOffset, setCanvasOffset] = useState(0)

  // set up canvas properties on component mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = 'black' // set default stroke color
        ctx.lineWidth = 2 // set default line width
      }
    }
  }, [])

  // begin drawing when user presses down
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e) // start drawing immediately
  }

  // stop drawing when user releases or exits the canvas
  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath() // reset path to prevent line continuation
      }
    }
  }

  // handle drawing on the canvas
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return // only draw if user is pressing down
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const rect = canvas.getBoundingClientRect() // get canvas bounds
        const x = e.clientX - rect.left // calculate x within canvas
        const y = e.clientY - rect.top + canvasOffset // calculate y with scroll offset
        ctx.lineTo(x, y) // draw line to this position
        ctx.stroke() // apply the stroke
        ctx.beginPath() // reset path
        ctx.moveTo(x, y) // move path to the current position
      }
    }
  }

  // clear the canvas content
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height) // clear entire canvas
      }
    }
    setCanvasOffset(0) // reset scroll offset after clearing
  }

  // handle vertical scrolling of the canvas
  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    // scroll down if not at max offset
    if (e.deltaY > 0 && canvasOffset < 1000) {
      setCanvasOffset(prev => prev + 20)
    // scroll up if not at min offset
    } else if (e.deltaY < 0 && canvasOffset > 0) {
      setCanvasOffset(prev => prev - 20)
    }
  }

  // generate a PDF from the canvas content
  const generatePDF = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const imgData = canvas.toDataURL('image/png') // get canvas as image
      const pdf = new jsPDF() // create new PDF
      pdf.addImage(imgData, 'PNG', 10, 10, canvas.width / 10, canvas.height / 10) // add image to PDF
      pdf.save('solution.pdf') // download PDF file
    }
  }

  // toggle microphone status
  const toggleMicrophone = () => {
    setIsMicOn(!isMicOn)
    // log microphone status change for now
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
          style={{marginTop: `-${canvasOffset}px`}} // apply vertical offset for scrolling
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
