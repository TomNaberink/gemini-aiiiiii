import TestChatBot from '@/components/TestChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Virtuele Economie Docent
            </h1>
            <p className="text-gray-600">
              Stel je vragen over economie, financiën en ondernemerschap
            </p>
          </div>
          <TestChatBot />
        </div>
      </div>
    </div>
  )
}