import React from 'react'
import LaTeX from './LaTeX'

interface QuestionProps {
  question: string
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-2">Question:</h2>
      <LaTeX>{question}</LaTeX>
    </div>
  )
}

export default Question