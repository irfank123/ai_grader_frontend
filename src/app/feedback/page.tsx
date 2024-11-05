'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import FeedbackPageHeader from '@/components/FeedbackPageHeader'
import FeedbackContent from '@/components/FeedbackContent'
import Solution from '@/components/Solution'
import Footer from '@/components/Footer'

export default function FeedbackPage() {
  const router = useRouter()

  // Sample feedback data (in a real application, this would come from an API or state management)
  const feedbackData = {
    grade: 'B+',
    writtenFeedback: 'Your solution demonstrates a good understanding of the domain concept. You correctly identified that the domain excludes x = ±2. However, you could improve by providing a more detailed explanation of why these values are excluded.',
    spokenFeedback: 'Your verbal explanation was clear and concise. You articulated the steps well, but you could enhance your explanation by discussing the implications of the denominator being zero and how it relates to the domain restrictions.',
    solution: 'To find the domain of $f(x) = \\frac{x+2}{x^2-4}$, we need to consider where the denominator is not zero:\n\n1) Set the denominator not equal to zero: $x^2 - 4 ≠ 0$\n2) Factor the denominator: $(x+2)(x-2) ≠ 0$\n3) Solve: $x ≠ -2$ and $x ≠ 2$\n\nTherefore, the domain is all real numbers except -2 and 2.\nIn interval notation: $(-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty)$'
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <FeedbackPageHeader />
          <div className="p-6 space-y-8">
            <FeedbackContent 
              grade={feedbackData.grade}
              writtenFeedback={feedbackData.writtenFeedback}
              spokenFeedback={feedbackData.spokenFeedback}
            />
            <Solution solution={feedbackData.solution} />
            <Button 
              onClick={() => router.push('/practice')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Another Question
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}