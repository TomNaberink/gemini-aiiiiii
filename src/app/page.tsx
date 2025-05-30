import TestChatBot from '@/components/TestChatBot'
import ChineseHistoryQuiz from '@/components/ChineseHistoryQuiz'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              💬
            </span>
            Geschiedenisleraar AI
          </h1>
          
          <p className="text-gray-600 mb-6">
            Hallo! Ik ben je persoonlijke geschiedenis assistent. Ik kan je helpen met:
            - Het uitleggen van historische gebeurtenissen
            - Het analyseren van historische periodes
            - Het beantwoorden van vragen over belangrijke figuren
            - Het leggen van verbanden tussen verschillende tijdperken
          </p>

          <TestChatBot />
          <ChineseHistoryQuiz />
        </div>
      </div>
    </div>
  )
}