'use client'

import { useState } from 'react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "Welke marktvorm kenmerkt zich door één aanbieder die alle macht heeft?",
    options: ["Monopolie", "Oligopolie", "Monopolistische concurrentie", "Volledige concurrentie"],
    correctAnswer: 0,
    explanation: "Een monopolie is een marktvorm waarbij er slechts één aanbieder is die volledige controle heeft over de markt. Bijvoorbeeld: in Nederland was de PTT vroeger de enige aanbieder van telefonie."
  },
  {
    id: 2,
    question: "Bij welke marktvorm zijn er veel aanbieders met gedifferentieerde producten?",
    options: ["Monopolie", "Oligopolie", "Monopolistische concurrentie", "Volledige concurrentie"],
    correctAnswer: 2,
    explanation: "Bij monopolistische concurrentie zijn er veel aanbieders die vergelijkbare, maar net verschillende producten aanbieden. Denk aan restaurants of kledingwinkels."
  },
  {
    id: 3,
    question: "Welke marktvorm heeft weinig grote aanbieders die elkaar sterk beïnvloeden?",
    options: ["Monopolie", "Oligopolie", "Monopolistische concurrentie", "Volledige concurrentie"],
    correctAnswer: 1,
    explanation: "Een oligopolie heeft enkele grote aanbieders die elkaars gedrag nauwlettend in de gaten houden. Bijvoorbeeld: de markt voor frisdrank (Coca-Cola, Pepsi) of smartphones (Apple, Samsung)."
  },
  {
    id: 4,
    question: "Bij welke marktvorm zijn er veel aanbieders met identieke producten?",
    options: ["Monopolie", "Oligopolie", "Monopolistische concurrentie", "Volledige concurrentie"],
    correctAnswer: 3,
    explanation: "Volledige concurrentie kenmerkt zich door veel aanbieders die identieke producten verkopen. Een voorbeeld is de groentemarkt, waar veel verkopers dezelfde producten aanbieden."
  }
]

export default function MarketStructuresQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Quiz: Marktvormen
      </h2>

      {!quizCompleted ? (
        <div>
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Vraag {currentQuestion + 1} van {questions.length}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <p className="text-lg text-gray-800 mb-4">
            {questions[currentQuestion].question}
          </p>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  selectedAnswer === null
                    ? 'hover:bg-blue-50 border border-gray-200'
                    : selectedAnswer === index
                    ? index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-100 border border-green-500'
                      : 'bg-red-100 border border-red-500'
                    : index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-100 border border-green-500'
                    : 'border border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-4">
              <p className={`p-4 rounded-lg ${
                selectedAnswer === questions[currentQuestion].correctAnswer
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                <strong>
                  {selectedAnswer === questions[currentQuestion].correctAnswer
                    ? '✓ Correct! '
                    : '✗ Helaas! '}
                </strong>
                {questions[currentQuestion].explanation}
              </p>
              <button
                onClick={nextQuestion}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Volgende Vraag' : 'Bekijk Resultaat'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">
            {score === questions.length ? '🎉' : '📚'} {score} / {questions.length}
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {score === questions.length
              ? 'Perfect! Je beheerst de marktvormen uitstekend!'
              : score >= questions.length / 2
              ? 'Goed gedaan! Je hebt een goede basiskennis van marktvormen.'
              : 'Je kunt je kennis van marktvormen nog verbeteren. Probeer het nog eens!'}
          </p>
          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quiz Opnieuw Maken
          </button>
        </div>
      )}
    </div>
  )
}