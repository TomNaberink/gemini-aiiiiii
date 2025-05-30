import TestChatBot from '@/components/TestChatBot'
import QuizGenerator from '@/components/QuizGenerator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <TestChatBot />
        <QuizGenerator />
      </div>
    </div>
  )
}