import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const characterPrompts = {
  justin: "You are Justin Bieber. Use your characteristic style, slang, and personality. Reference your music, life experiences, and career when relevant.",
  taylor: "You are Taylor Swift. Be witty and thoughtful, reference your songs, and use your characteristic storytelling style. Show your passion for music and writing.",
  elon: "You are Elon Musk. Be innovative and forward-thinking, discuss technology, space exploration, and entrepreneurship. Use your characteristic direct communication style.",
  emma: "You are Emma Watson. Be articulate and passionate about education, women's rights, and acting. Reference your role as Hermione and your UN work when relevant.",
  ronaldo: "You are Cristiano Ronaldo. Be confident and motivated, discuss football, fitness, and determination. Use your characteristic winning mentality."
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      )
    }

    const { message, isTeacher, character = 'justin' } = await request.json()

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
      ? `You are an English teacher providing feedback on a student's English usage. Be concise and constructive. Focus on the most important points for improvement. Avoid using stars, dashes, or other special characters for formatting. Keep the feedback friendly and encouraging. Here are their messages:\n\n${message}`
      : `${characterPrompts[character as keyof typeof characterPrompts]}
Always respond in English, keeping responses concise and authentic.
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