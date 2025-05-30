'use client'

import { useState } from 'react'

export default function QuizGenerator() {
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quiz, setQuiz] = useState<{
    questions: Array<{
      question: string
      options: string[]
      correctAnswer: string
    }>
  } | null>(null)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const generateQuiz = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setQuiz(null)
    setUserAnswers([])
    setShowResults(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Genereer een quiz van 2 multiple choice vragen over het onderwerp: ${topic}. 
          Geef het antwoord in het volgende JSON formaat:
          {
            "questions": [
              {
                "question": "De vraag hier",
                "options": ["optie 1", "optie 2", "optie 3", "optie 4"],
                "correctAnswer": "het juiste antwoord hier"
              }
            ]
          }`
        }),
      })

      if (!response.ok) {
        throw new Error('Fout bij het genereren van de quiz')
      }

      const data = await response.json()
      try {
        const quizData = JSON.parse(data.response.replace(/```json|```/g, '').trim())
        setQuiz(quizData)
      } catch (e) {
        throw new Error('Ongeldig quiz formaat ontvangen')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Er ging iets mis bij het maken van de quiz')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const checkAnswers = () => {
    setShowResults(true)
  }

  const getScore = () => {
    if (!quiz) return 0
    return quiz.questions.reduce((score, question, index) => {
      return score + (question.correctAnswer === userAnswers[index] ? 1 : 0)
    }, 0)
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
        <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2">
          <span className="text-white text-sm">❓</span>
        </span>
        Quiz Generator
      </h3>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Voer een onderwerp in voor de quiz..."
            className="flex-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            onClick={generateQuiz}
            disabled={isLoading || !topic.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Genereren...' : 'Genereer Quiz'}
          </button>
        </div>

        {isLoading && (
          <div className="p-4 bg-purple-100 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <span className="text-purple-700">Quiz wordt gegenereerd...</span>
            </div>
          </div>
        )}

        {quiz && (
          <div className="space-y-6">
            {quiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-medium text-gray-800 mb-3">
                  {questionIndex + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={option}
                        checked={userAnswers[questionIndex] === option}
                        onChange={() => handleAnswer(questionIndex, option)}
                        className="text-purple-600 focus:ring-purple-500"
                        disabled={showResults}
                      />
                      <span className={`
                        ${showResults && option === question.correctAnswer ? 'text-green-600 font-medium' : ''}
                        ${showResults && userAnswers[questionIndex] === option && option !== question.correctAnswer ? 'text-red-600 line-through' : ''}
                      `}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {!showResults && userAnswers.length === quiz.questions.length && (
              <button
                onClick={checkAnswers}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                Controleer Antwoorden
              </button>
            )}

            {showResults && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                getScore() === quiz.questions.length ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Je score: {getScore()} van de {quiz.questions.length} vragen correct!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}