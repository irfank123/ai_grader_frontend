import React from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

interface QuestionProps {
  question: string
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4 text-left">Question:</h2>
      <div className="text-center text-xl">
        <Latex>{question}</Latex>
      </div>
    </div>
  )
}

export default Question