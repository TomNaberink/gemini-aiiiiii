import React, { useState } from 'react'

interface FeedbackScores {
  content: number
  argumentation: number
  structure: number
  language: number
  originality: number
}

interface DetailedFeedback {
  top: string
  tip: string
  examples?: string[]
}

interface FeedbackResult {
  scores: FeedbackScores
  feedback: {
    content: DetailedFeedback
    argumentation: DetailedFeedback
    structure: DetailedFeedback
    language: DetailedFeedback
    originality: DetailedFeedback
  }
  totalScore: number
  overallFeedback: string
  metrics: {
    wordCount: number
    sentenceCount: number
    paragraphCount: number
    avgSentenceLength: number
    avgParagraphLength: number
    complexWordPercentage: number
    argumentMarkerCount: number
    transitionWordCount: number
  }
}

export default function FileUploadWithFeedback() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)

  const analyzeFeedback = (content: string): FeedbackResult => {
    // Basic text analysis
    const words = content.split(/\s+/).filter(word => word.length > 0)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgSentenceLength = words.length / sentences.length
    const avgParagraphLength = words.length / paragraphs.length

    // Find example sentences
    const getExampleSentence = (pattern: string): string | undefined => {
      return sentences.find(s => s.toLowerCase().includes(pattern.toLowerCase()))?.trim()
    }

    // Content Analysis
    let contentScore = 0
    const contentFeedback: DetailedFeedback = {
      top: '',
      tip: '',
      examples: []
    }

    // Analyze depth and coverage
    const keywordDensity = new Set(words.map(w => w.toLowerCase())).size / words.length
    if (keywordDensity > 0.6) {
      contentScore += 4
      contentFeedback.top = "Je tekst laat een indrukwekkende diepgang zien in de behandeling van het onderwerp. Je gebruikt een rijk vocabulaire en weet complexe concepten helder uit te leggen."
    } else {
      contentFeedback.tip = "Je zou je analyse kunnen verdiepen door meer specifieke voorbeelden en details toe te voegen. Probeer elk hoofdpunt te ondersteunen met concrete voorbeelden."
    }

    // Find good examples
    const detailedSentence = sentences.find(s => s.split(/\s+/).length > 15)
    if (detailedSentence) {
      contentFeedback.examples?.push(`Goede detaillering: "${detailedSentence.trim()}"`)
    }

    // Argumentation Analysis
    let argumentationScore = 0
    const argumentationFeedback: DetailedFeedback = {
      top: '',
      tip: '',
      examples: []
    }

    // Analyze argument structure
    const argumentMarkers = ['omdat', 'dus', 'daarom', 'echter', 'bovendien']
    const foundMarkers = argumentMarkers.filter(marker => 
      content.toLowerCase().includes(marker)
    )

    if (foundMarkers.length > 3) {
      argumentationScore += 4
      argumentationFeedback.top = "Je argumentatie is sterk en logisch opgebouwd. Je maakt effectief gebruik van verbindingswoorden om je redenering te verduidelijken."
      
      // Add example
      const exampleSentence = getExampleSentence(foundMarkers[0])
      if (exampleSentence) {
        argumentationFeedback.examples?.push(`Sterk argument: "${exampleSentence}"`)
      }
    } else {
      argumentationFeedback.tip = "Je kunt je argumentatie versterken door meer gebruik te maken van verbindingswoorden. Probeer je redeneringen explicieter te maken door woorden als 'omdat', 'daarom' en 'echter' te gebruiken."
    }

    // Structure Analysis
    let structureScore = 0
    const structureFeedback: DetailedFeedback = {
      top: '',
      tip: '',
      examples: []
    }

    // Analyze paragraph structure
    if (paragraphs.length >= 5) {
      structureScore += 4
      structureFeedback.top = "Je tekst heeft een heldere, logische structuur met goed gebalanceerde paragrafen. De opbouw van je argumenten is overzichtelijk en makkelijk te volgen."
    } else {
      structureFeedback.tip = "Je zou je tekst kunnen versterken door deze op te delen in meer paragrafen. Begin elke nieuwe paragraaf met een duidelijke hoofdgedachte en werk deze vervolgens uit."
    }

    // Language Analysis
    let languageScore = 0
    const languageFeedback: DetailedFeedback = {
      top: '',
      tip: '',
      examples: []
    }

    // Analyze language variety
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
    const vocabularyRatio = uniqueWords / words.length

    if (vocabularyRatio > 0.6) {
      languageScore += 4
      languageFeedback.top = "Je taalgebruik is rijk en gevarieerd. Je weet complexe ideeën helder over te brengen zonder in herhaling te vallen."
      
      // Find sophisticated sentence
      const longSentence = sentences.find(s => s.split(/\s+/).length > 20)
      if (longSentence) {
        languageFeedback.examples?.push(`Goed geformuleerde zin: "${longSentence.trim()}"`)
      }
    } else {
      languageFeedback.tip = "Probeer je woordkeuze te variëren. Kijk of je sommige woorden kunt vervangen door synoniemen om herhaling te voorkomen."
    }

    // Originality Analysis
    let originalityScore = 0
    const originalityFeedback: DetailedFeedback = {
      top: '',
      tip: '',
      examples: []
    }

    // Analyze unique perspectives
    const personalPronouns = ['ik', 'mijn', 'wij', 'onze'].some(pronoun => 
      content.toLowerCase().includes(pronoun)
    )

    if (personalPronouns) {
      originalityScore += 4
      originalityFeedback.top = "Je schrijfstijl is persoonlijk en authentiek. Je durft je eigen stem te laten horen en brengt originele perspectieven in."
      
      // Find personal perspective
      const personalSentence = sentences.find(s => 
        ['ik', 'mijn', 'wij', 'onze'].some(p => s.toLowerCase().includes(p))
      )
      if (personalSentence) {
        originalityFeedback.examples?.push(`Persoonlijk perspectief: "${personalSentence.trim()}"`)
      }
    } else {
      originalityFeedback.tip = "Durf meer je eigen stem te laten horen. Deel je persoonlijke inzichten en ervaringen waar relevant, zonder de academische toon te verliezen."
    }

    // Calculate final scores
    const scores = {
      content: Math.min(8, contentScore + 4), // Base score + analysis score
      argumentation: Math.min(8, argumentationScore + 4),
      structure: Math.min(8, structureScore + 4),
      language: Math.min(8, languageScore + 4),
      originality: Math.min(8, originalityScore + 4)
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5

    // Generate overall feedback
    const overallFeedback = `Je tekst toont ${totalScore > 6 ? 'uitstekend' : totalScore > 4 ? 'goed' : 'voldoende'} begrip van het onderwerp. ${
      contentFeedback.top || contentFeedback.tip
    } ${
      argumentationFeedback.top || argumentationFeedback.tip
    } ${
      structureFeedback.top || structureFeedback.tip
    }`

    return {
      scores,
      feedback: {
        content: contentFeedback,
        argumentation: argumentationFeedback,
        structure: structureFeedback,
        language: languageFeedback,
        originality: originalityFeedback
      },
      totalScore,
      overallFeedback,
      metrics: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        avgSentenceLength,
        avgParagraphLength,
        complexWordPercentage: (words.filter(w => w.length > 10).length / words.length) * 100,
        argumentMarkerCount: foundMarkers.length,
        transitionWordCount: foundMarkers.length
      }
    }
  }

  const handleFileSelect = async (file: File) => {
    const isDocx = file.name.endsWith('.docx')
    const isPdf = file.name.endsWith('.pdf')
    
    if (!isDocx && !isPdf) {
      alert('Alleen .docx en .pdf bestanden zijn toegestaan!')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)
    setFeedback(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      const feedbackResult = analyzeFeedback(data.content)
      setFeedback(feedbackResult)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Er is een fout opgetreden bij het uploaden van het bestand.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              Sleep je document hier naartoe
            </p>
            <p className="text-sm text-gray-500 mt-1">
              of klik om een bestand te selecteren
            </p>
          </div>
          
          <input
            type="file"
            accept=".docx,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
            className="hidden"
            id="file-input"
          />
          
          <label
            htmlFor="file-input"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Bestand Selecteren
          </label>
          
          <p className="text-xs text-gray-400">
            Ondersteunde formaten: .docx, .pdf (max 10MB)
          </p>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Document wordt geanalyseerd...</span>
          </div>
        </div>
      )}

      {/* Feedback Display */}
      {feedback && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y">
          {/* Overall Score and Feedback */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Totale Beoordeling
              </h3>
              <div className="text-3xl font-bold text-purple-600">
                {feedback.totalScore.toFixed(1)} / 8.0
              </div>
            </div>
            <p className="text-gray-600 bg-purple-50 p-4 rounded-lg">
              {feedback.overallFeedback}
            </p>

            {/* Document Metrics */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Woorden</div>
                <div className="text-lg font-semibold">{feedback.metrics.wordCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Zinnen</div>
                <div className="text-lg font-semibold">{feedback.metrics.sentenceCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Paragrafen</div>
                <div className="text-lg font-semibold">{feedback.metrics.paragraphCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Gem. Zinslengte</div>
                <div className="text-lg font-semibold">
                  {feedback.metrics.avgSentenceLength.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Feedback with TOP/TIP */}
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Gedetailleerde Feedback
            </h3>
            
            {Object.entries(feedback.feedback).map(([category, feedbackItem]) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700 capitalize">
                    {category}
                  </h4>
                  <span className={`font-semibold ${
                    feedback.scores[category as keyof typeof feedback.scores] > 6
                      ? 'text-emerald-600'
                      : feedback.scores[category as keyof typeof feedback.scores] > 4
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {feedback.scores[category as keyof typeof feedback.scores]} / 8
                  </span>
                </div>

                <div className="space-y-4">
                  {feedbackItem.top && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800 mb-1">TOP</div>
                      <p className="text-green-700">{feedbackItem.top}</p>
                    </div>
                  )}

                  {feedbackItem.tip && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-medium text-orange-800 mb-1">TIP</div>
                      <p className="text-orange-700">{feedbackItem.tip}</p>
                    </div>
                  )}

                  {feedbackItem.examples && feedbackItem.examples.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Voorbeelden</div>
                      {feedbackItem.examples.map((example, index) => (
                        <p key={index} className="text-gray-600 text-sm italic">
                          {example}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}