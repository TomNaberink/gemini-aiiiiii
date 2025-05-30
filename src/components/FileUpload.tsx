'use client'

import { useState } from 'react'

interface FileUploadProps {
  onFileUpload?: (file: File) => Promise<{ name: string, content: string } | null>
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileSelect(files[0])
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

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      alert('Alleen .docx en .pdf bestanden zijn toegestaan!')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Bestand is te groot! Maximum grootte is 10MB.')
      return
    }

    setIsUploading(true)
    try {
      if (onFileUpload) {
        await onFileUpload(file)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFileSelect(files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-3 transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : isUploading
          ? 'border-gray-300 bg-gray-50'
          : 'border-gray-300 hover:border-blue-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex items-center justify-center">
        <input
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="flex items-center space-x-2 cursor-pointer"
        >
          <span className="text-gray-600 text-sm">
            {isUploading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></span>
                Bezig met uploaden...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">📎</span>
                Sleep een bestand of klik om te uploaden
              </span>
            )}
          </span>
        </label>
      </div>
    </div>
  )
}