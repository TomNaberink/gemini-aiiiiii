import TestGenerator from '@/components/TestGenerator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <TestGenerator />
        </div>
      </div>
    </div>
  )
}