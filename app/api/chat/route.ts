import { NextResponse } from 'next/server'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export async function POST(req: Request) {
  console.log('API route called')
  
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('Gemini API key is missing')
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].text

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: lastMessage
              }
            ]
          }
        ]
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Gemini API response:', data)

    const generatedText = data.candidates[0].content.parts[0].text
    return NextResponse.json({ result: generatedText })
  } catch(error: any) {
    console.error('Error in API route:', error)
    return NextResponse.json({ 
      error: `Error in API route: ${error.message || 'Unknown error'}` 
    }, { status: 500 })
  }
}

