import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Welke dynastie wordt gezien als de eerste keizerlijke dynastie van China?",
    options: ["Han Dynastie", "Qin Dynastie", "Zhou Dynastie", "Tang Dynastie"],
    correctAnswer: 1,
    explanation: "De Qin Dynastie (221-206 v.Chr.) wordt beschouwd als de eerste keizerlijke dynastie van China. Qin Shi Huangdi verenigde China en werd de eerste keizer."
  },
  {
    id: 2,
    question: "Wat was een van de grootste bouwprojecten tijdens de Qin dynastie?",
    options: ["De Verboden Stad", "De Chinese Muur", "Het Terracottaleger", "De Zijderoute"],
    correctAnswer: 1,
    explanation: "Hoewel er al eerder verdedigingsmuren waren gebouwd, werd tijdens de Qin dynastie begonnen met het verbinden en uitbreiden van deze muren tot wat we nu kennen als de Chinese Muur."
  },
  {
    id: 3,
    question: "Tijdens welke dynastie werd het kompas uitgevonden?",
    options: ["Song Dynastie", "Ming Dynastie", "Yuan Dynastie", "Tang Dynastie"],
    correctAnswer: 0,
    explanation: "Het kompas werd uitgevonden tijdens de Song Dynastie (960-1279). Deze periode staat bekend om zijn vele technologische innovaties."
  },
  {
    id: 4,
    question: "Welke filosofische stroming, gesticht door Confucius, had grote invloed op de Chinese samenleving?",
    options: ["Taoïsme", "Boeddhisme", "Confucianisme", "Legalisme"],
    correctAnswer: 2,
    explanation: "Confucianisme, gesticht door Confucius (551-479 v.Chr.), heeft een enorme impact gehad op de Chinese cultuur, politiek en sociale normen."
  },
  {
    id: 5,
    question: "Welke uitvinding uit het oude China wordt gezien als een van de Vier Grote Uitvindingen?",
    options: ["Porselein", "Zijde", "Papier", "Thee"],
    correctAnswer: 2,
    explanation: "Papier is een van de Vier Grote Uitvindingen van China, samen met het kompas, buskruit en de boekdrukkunst. Het werd uitgevonden tijdens de Han dynastie."
  }
];

export default function ChineseHistoryQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setQuizCompleted(false);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          🏺
        </span>
        Chinese Geschiedenis Quiz
      </h2>

      {!quizCompleted ? (
        <div>
          <div className="mb-4">
            <span className="text-sm text-purple-600 font-medium">
              Vraag {currentQuestion + 1} van {questions.length}
            </span>
            <div className="h-2 bg-purple-100 rounded-full mt-2">
              <div 
                className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg transition-colors ${
                    showExplanation
                      ? index === questions[currentQuestion].correctAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : index === selectedAnswer
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-50 border-2 border-transparent'
                      : selectedAnswer === index
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gray-50 hover:bg-purple-50 border-2 border-transparent'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <span className="font-medium">Uitleg: </span>
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}

          {showExplanation && (
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Volgende Vraag' : 'Bekijk Resultaat'}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-purple-800 mb-2">
              Quiz Voltooid!
            </h3>
            <p className="text-gray-600">
              Je score: {score} van de {questions.length} vragen goed!
            </p>
          </div>

          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Opnieuw Proberen
          </button>
        </div>
      )}
    </div>
  );
}