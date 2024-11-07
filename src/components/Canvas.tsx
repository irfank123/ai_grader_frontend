'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function P5Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [audioData, setAudioData] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState(Date.now())

  const setup = (p5: any, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(window.innerWidth - 430, window.innerHeight).parent(canvasParentRef)
    canvasRef.current = canvasParentRef.querySelector('canvas') as HTMLCanvasElement
    p5.background(255)
    p5.strokeWeight(4)
    p5.stroke(0)
    p5.noFill()
    canvas.touchStarted(() => false)
    canvas.touchMoved(() => false)
    canvas.touchEnded(() => false)
  }

  const draw = (p5: any) => {
    if (Date.now() - lastSaveTime > 10000) {
      saveCanvasToMongoDB()
      setLastSaveTime(Date.now())
    }

    if (p5.mouseIsPressed || p5.touches.length > 0) {
      const x = p5.touches.length > 0 ? p5.touches[0].x : p5.mouseX
      const y = p5.touches.length > 0 ? p5.touches[0].y : p5.mouseY
      p5.line(p5.pmouseX, p5.pmouseY, x, y)
    }
  }

  const saveCanvasToMongoDB = async () => {
    if (canvasRef.current) {
      const blob = await new Promise<Blob>((resolve) => canvasRef.current!.toBlob(resolve as BlobCallback))
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64data = reader.result as string

        // Save to MongoDB (Replace with actual API endpoint)
        const response = await fetch("http://localhost:3000/api/v1/users/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            canvas: base64data,
            audio: audioData
          })
        })

        if (response.ok) {
          console.log('Canvas and audio saved to MongoDB')
        } else {
          console.error('Error saving to MongoDB')
        }
      }
      reader.readAsDataURL(blob)
    }
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const handleAudioRecording = () => {
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
    setIsRecording(!isRecording)
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const newRecorder = new MediaRecorder(stream)
    const audioChunks: Blob[] = []

    newRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    newRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAudioData(reader.result as string)
      }
      reader.readAsDataURL(audioBlob)
    }

    newRecorder.start()
    setRecorder(newRecorder)
  }

  const stopRecording = () => {
    recorder?.stop()
  }

  useEffect(() => {
    return () => {
      saveCanvasToMongoDB()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-x-4">
        <button onClick={saveCanvasToMongoDB} className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit Answer
        </button>
        <button onClick={clearCanvas} className="px-4 py-2 bg-red-500 text-white rounded">
          Clear Canvas
        </button>
        <button onClick={handleAudioRecording} className={`px-4 py-2 ${isRecording ? 'bg-gray-500' : 'bg-green-500'} text-white rounded`}>
          {isRecording ? 'Stop Recording' : 'Record Audio'}
        </button>
      </div>
    </div>
  )
}
