'use client'

import React from 'react'
import FeedbackPageHeader from '@/components/FeedbackPageHeader'
import FeedbackContent from '@/components/FeedbackContent'
import Footer from '@/components/Footer'

export default function FeedbackPage() {
  // Sample feedback data (in a real application, this would come from an API or state management)
  const feedbackData = {
    grade: 'B+',
    writtenFeedback: 'Your solution demonstrates a good understanding of the domain concept. You correctly identified that the domain excludes x = ±2. However, you could improve by providing a more detailed explanation of why these values are excluded.',
    spokenFeedback: 'Your verbal explanation was clear and concise. You articulated the steps well, but you could enhance your explanation by discussing the implications of the denominator being zero and how it relates to the domain restrictions.'
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <FeedbackPageHeader />
          <div className="p-6">
            <FeedbackContent 
              grade={feedbackData.grade}
              writtenFeedback={feedbackData.writtenFeedback}
              spokenFeedback={feedbackData.spokenFeedback}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}