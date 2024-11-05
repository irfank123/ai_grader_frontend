'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import PracticePageHeader from '@/components/PracticePageHeader'
import ModeToggle from '@/components/ModeToggle'
import Question from '@/components/Question'
import Canvas from '@/components/Canvas'
import Footer from '@/components/Footer'
import SubmitButton from '@/components/ui/submit-button'
import QuestionNavigation from '@/components/QuestionNavigation'

export default function PracticePage() {
  const [mode, setMode] = useState<'practice' | 'exam'>('practice')
  const router = useRouter()
  
  // Precalculus question in LaTeX format
  const question = "Find the domain of $f(x) = \\frac{x+2}{x^2-4}$"

  const handleSubmit = () => {
    router.push('/feedback')
  }

  const handleNextQuestion = () => {
    console.log("Next question")
    // This will be implemented later with database integration
  }

  const handlePreviousQuestion = () => {
    console.log("Previous question")
    // This will be implemented later with database integration
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <PracticePageHeader />
          
          <div className="p-6">
            <ModeToggle mode={mode} setMode={setMode} />
            
            <Question question={question} />
            
            <QuestionNavigation
              onPreviousQuestion={handlePreviousQuestion}
              onNextQuestion={handleNextQuestion}
            />
            
            <Canvas />
            
            <SubmitButton onClick={handleSubmit} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}