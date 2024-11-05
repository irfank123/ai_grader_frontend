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
  // State to manage the current mode (practice or exam)
  const [mode, setMode] = useState<'practice' | 'exam'>('practice')
  const router = useRouter()
  
  // Precalculus question in LaTeX format
  const question = "\\text{Find the domain of } f(x) = \\frac{x+2}{x^2-4}"

  // Function to handle answer submission
  const handleSubmit = () => {
    // For now, we'll just navigate to the feedback page
    router.push('/feedback')
  }

  // Placeholder functions for question navigation
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
          {/* Header component for the practice page */}
          <PracticePageHeader />
          
          <div className="p-6">
            {/* Toggle component to switch between practice and exam modes */}
            <ModeToggle mode={mode} setMode={setMode} />
            
            {/* Component to display the current question */}
            <Question question={question} />
            
            {/* New component for question navigation */}
            <QuestionNavigation
              onPreviousQuestion={handlePreviousQuestion}
              onNextQuestion={handleNextQuestion}
            />
            
            {/* Canvas component for user to write their solution */}
            <Canvas />
            
            {/* Button component to submit the answer */}
            <SubmitButton onClick={handleSubmit} />
          </div>
        </div>
      </div>
      
      {/* Footer component */}
      <Footer />
    </div>
  )
}