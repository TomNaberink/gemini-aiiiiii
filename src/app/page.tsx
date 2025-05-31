'use client'

import FileUploadWithFeedback from '@/components/FileUploadWithFeedback'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                📝
              </span>
              Document Feedback System
            </h1>
            <FileUploadWithFeedback />
          </div>
        </div>
      </div>
    </div>
  )
}