'use client'

import { useState } from 'react'

type QuestionType = 'multiple-choice' | 'true-false' | 'open'
type EducationLevel = 'high-school' | 'bachelor' | 'university'
type BloomLevel = 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation'

interface TestConfig {
  questionType: QuestionType
  questionCount: number
  educationLevel: EducationLevel
  bloomLevels: BloomLevel[]
  needsCase: boolean
  subject: string
  context: string
}

export default function TestGenerator() {
  const [config, setConfig] = useState<TestConfig>({
    questionType: 'multiple-choice',
    questionCount: 5,
    educationLevel: 'bachelor',
    bloomLevels: ['knowledge'],
    needsCase: false,
    subject: '',
    context: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const prompt = `Als toetsexpert met specialisatie kennistoetsen, genereer ${config.questionCount} ${config.questionType} vragen.
        Niveau: ${config.educationLevel}
        Bloom niveaus: ${config.bloomLevels.join(', ')}
        ${config.needsCase ? 'Met korte casus voor elke vraag' : 'Zonder casus'}
        Onderwerp: ${config.subject}
        Context: ${config.context}`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      })

      const data = await response.json()
      setQuestions(data.response)
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center">
        <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
          📝
        </span>
        Toetsgenerator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Type toetsvragen
          </label>
          <select
            value={config.questionType}
            onChange={(e) => setConfig({ ...config, questionType: e.target.value as QuestionType })}
            className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="multiple-choice">Meerkeuzevragen</option>
            <option value="true-false">Juist/Onjuist vragen</option>
            <option value="open">Open vragen</option>
          </select>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Aantal vragen
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={config.questionCount}
            onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
            className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Onderwijsniveau
          </label>
          <select
            value={config.educationLevel}
            onChange={(e) => setConfig({ ...config, educationLevel: e.target.value as EducationLevel })}
            className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="high-school">Middelbare school</option>
            <option value="bachelor">HBO</option>
            <option value="university">Universiteit</option>
          </select>
        </div>

        {/* Bloom Levels */}
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Bloom niveaus
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation'].map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.bloomLevels.includes(level as BloomLevel)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfig({ ...config, bloomLevels: [...config.bloomLevels, level as BloomLevel] })
                    } else {
                      setConfig({ ...config, bloomLevels: config.bloomLevels.filter(l => l !== level) })
                    }
                  }}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Case Requirement */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.needsCase}
              onChange={(e) => setConfig({ ...config, needsCase: e.target.checked })}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Korte casus bij elke vraag</span>
          </label>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Onderwerp
          </label>
          <input
            type="text"
            value={config.subject}
            onChange={(e) => setConfig({ ...config, subject: e.target.value })}
            placeholder="Bijv. Nederlandse Geschiedenis, Wiskunde, Biologie..."
            className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Context (optioneel)
          </label>
          <textarea
            value={config.context}
            onChange={(e) => setConfig({ ...config, context: e.target.value })}
            placeholder="Voeg hier eventuele context toe, zoals leerdoelen of specifieke onderwerpen..."
            rows={4}
            className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !config.subject}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? 'Vragen genereren...' : 'Genereer vragen'}
        </button>
      </form>

      {/* Generated Questions */}
      {questions && (
        <div className="mt-8 p-4 bg-white rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">Gegenereerde vragen:</h3>
          <div className="whitespace-pre-wrap text-gray-700">
            {questions}
          </div>
        </div>
      )}
    </div>
  )
}