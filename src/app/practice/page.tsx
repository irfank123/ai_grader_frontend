'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import PracticePageHeader from '@/components/PracticePageHeader'
import ModeToggle from '@/components/ModeToggle'
import Question from '@/components/Question'
import Canvas from '@/components/Canvas'
import Footer from '@/components/Footer'
import SubmitButton from '@/components/ui/submit-button'
import QuestionNavigation from '@/components/QuestionNavigation'

interface QuestionData {
  index: number
  question: string
  answer: string
  solution: string
  ai_solution: string
  written_feedback: string
  spoken_feedback: string
}

export default function PracticePage() {
  const [mode, setMode] = useState<'practice' | 'exam'>('practice')
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetch('/mock_data.csv')
      const csvData = await response.text()
      const parsedData = Papa.parse<QuestionData>(csvData, { header: true })
      setQuestions(parsedData.data)
    }
    loadQuestions()
  }, [])

  const handleSubmit = () => {
    router.push(`/feedback?questionIndex=${currentQuestionIndex}`)
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex + 1 < questions.length ? prevIndex + 1 : 0
    )
  }

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex - 1 >= 0 ? prevIndex - 1 : questions.length - 1
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <PracticePageHeader />
          
          <div className="p-6">
            <ModeToggle mode={mode} setMode={setMode} />
            
            {questions.length > 0 && (
              <Question question={questions[currentQuestionIndex].question} />
            )}
            
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