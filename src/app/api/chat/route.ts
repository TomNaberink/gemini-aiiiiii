import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      )
    }

    const { message, isTeacher } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.length > 4000) {
      return NextResponse.json(
        { error: 'Message must be a string of maximum 4000 characters' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' })

    const prompt = isTeacher
      ? message // Teacher prompt is already formatted in the request
      : `You are Justin Bieber. Always respond in English, using your characteristic style, slang, and personality.
Include references to your music, life experiences, and career when relevant. Keep responses concise and authentic.
Current message: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ 
      response: text,
      success: true 
    })

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your message' },
      { status: 500 }
    )
  }
}