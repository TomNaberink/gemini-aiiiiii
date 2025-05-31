'use client'

import { useState } from 'react'

interface FileUploadProps {
  onFileUpload?: (file: File) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.docx')) {
      alert('Alleen .docx bestanden zijn toegestaan!')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)
    setResult(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const data = await response.json()
      setResult(data)
      
      if (onFileUpload) {
        onFileUpload(file)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setResult({
        error: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het uploaden van het bestand.'
      })
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
            accept=".docx"
            onChange={handleFileInput}
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
            Ondersteund formaat: .docx (max 10MB)
          </p>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Bestand wordt verwerkt...</span>
          </div>
        </div>
      )}

      {/* Uploaded File Info */}
      {uploadedFile && !isProcessing && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <p className="font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-sm text-green-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                {result?.fileType && ` • ${result.fileType}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {result?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="font-medium text-red-800">Fout bij verwerken</p>
              <p className="text-sm text-red-600">{result.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result?.content && !result?.error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Bestand Inhoud:</h4>
            <div className="text-xs text-gray-500 space-x-4">
              {result.wordCount && <span>{result.wordCount} woorden</span>}
              {result.characterCount && <span>{result.characterCount} karakters</span>}
            </div>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto bg-white p-3 rounded border">
            {result.content.length > 500 
              ? `${result.content.substring(0, 500)}...` 
              : result.content
            }
          </div>
          {result.content.length > 500 && (
            <p className="text-xs text-gray-500 mt-2">
              Eerste 500 karakters getoond. Volledige inhoud beschikbaar via API.
            </p>
          )}
        </div>
      )}
    </div>
  )
}