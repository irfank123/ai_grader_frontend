import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface FeedbackContentProps {
  grade: string
  writtenFeedback: string
  spokenFeedback: string
}

const FeedbackContent: React.FC<FeedbackContentProps> = ({ grade, writtenFeedback, spokenFeedback }) => {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Your Grade</h2>
        <p className="text-4xl font-bold text-blue-600">{grade}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Written Solution Feedback</h3>
        <p className="text-gray-700">{writtenFeedback}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Spoken Explanation Feedback</h3>
        <p className="text-gray-700">{spokenFeedback}</p>
      </div>

      <Button 
        onClick={() => router.push('/practice')} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Try Another Question
      </Button>
    </div>
  )
}

export default FeedbackContent