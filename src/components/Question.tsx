import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface QuestionProps {
  question: string
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  // Clean up the LaTeX string by ensuring proper spacing and math mode
  const cleanedQuestion = question
    .replace(/\\/g, '\\')  // Ensure backslashes are preserved
    .replace(/\s+/g, ' ')  // Normalize spaces
    .trim()

  const renderedQuestion = katex.renderToString(cleanedQuestion, {
    throwOnError: false,
    displayMode: true,
    strict: false,
    trust: true,
    macros: {
      "\\f": "f(x)"  // Add common macros if needed
    }
  })

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">Question:</h2>
      <div 
        dangerouslySetInnerHTML={{ __html: renderedQuestion }} 
        className="katex-display"
      />
    </div>
  )
}

export default Question