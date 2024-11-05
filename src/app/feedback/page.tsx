"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import FeedbackPageHeader from "@/components/FeedbackPageHeader";
import FeedbackContent from "@/components/FeedbackContent";
import Solution from "@/components/Solution";
import Footer from "@/components/Footer";

// Define the structure of our question data
interface QuestionData {
  index: number;
  question: string;
  answer: string;
  solution: string;
  written_feedback: string;
  spoken_feedback: string;
  grade: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        // Fetch the CSV file
        const response = await fetch("/mock_data.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvData = await response.text();

        // Parse the CSV data
        const parsedData = Papa.parse<QuestionData>(csvData, { header: true }).data;
        setTotalQuestions(parsedData.length);

        // Retrieve the current question index from localStorage
        const storedIndex = localStorage.getItem("currentQuestionIndex");
        if (storedIndex === null) {
          throw new Error("No question index found");
        }

        const questionIndex = parseInt(storedIndex, 10);

        // Find the current question data
        const currentQuestion = parsedData[questionIndex];
        if (currentQuestion) {
          setQuestionData(currentQuestion);
        } else {
          setError(`Question with index ${questionIndex} not found`);
        }
      } catch (error) {
        console.error("Error loading question data:", error);
        setError("Failed to load question data. Please try again.");
      }
    };

    loadQuestionData();
  }, []);

  // Handler for the "Try Another Question" button
  const handleTryAnotherQuestion = () => {
    const currentIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0", 10);
    const nextIndex = (currentIndex + 1) % totalQuestions;
    // Update localStorage with the next index
    localStorage.setItem("currentQuestionIndex", nextIndex.toString());
    // Redirect to the practice page
    router.push("/practice");
  };

  // Show error message if there's an error
  if (error) {
    return <div className='text-red-500 p-4'>{error}</div>;
  }

  // Show loading state while fetching data
  if (!questionData) {
    return <div className='p-4'>Loading...</div>;
  }

  // Render the feedback page
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <div className='flex-grow p-8'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
          <FeedbackPageHeader />
          <div className='p-6 space-y-8'>
            <FeedbackContent
              grade={questionData.grade}
              writtenFeedback={questionData.written_feedback}
              spokenFeedback={questionData.spoken_feedback}
            />
            <Solution solution={questionData.solution} />
            <Button
              onClick={handleTryAnotherQuestion}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white'
            >
              Try Another Question
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
