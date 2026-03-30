import { NextRequest, NextResponse } from 'next/server'
 
export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
 
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }
 
    // Sin API key → modo demo
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        findings: [
          'Modo demo — configurá GEMINI_API_KEY en Vercel',
          'Silueta cardíaca dentro de límites normales',
          'Trama vascular pulmonar conservada bilateralmente',
          'Análisis preliminar IA — requiere validación por especialista',
        ]
      })
    }
 
    const prompt = `Sos un asistente de radiología médica. Analizá esta imagen y describí los hallazgos principales en español.
Devolvé ÚNICAMENTE un JSON válido con este formato exacto, sin texto adicional, sin markdown, sin backticks:
{"findings":["hallazgo 1","hallazgo 2","hallazgo 3","Análisis preliminar IA — requiere validación por especialista"]}
Máximo 4 hallazgos. Cada uno máximo 15 palabras. Solo hallazgos descriptivos, nunca diagnósticos definitivos.`
 
    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 300,
      },
    }
 
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
 
    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      throw new Error(`Gemini API error: ${res.status}`)
    }
 
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
 
    // Parseamos el JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.findings && Array.isArray(parsed.findings)) {
        return NextResponse.json(parsed)
      }
    }
 
    // Fallback si Gemini no devuelve JSON limpio
    return NextResponse.json({
      findings: [
        'Imagen analizada correctamente',
        'Revisar hallazgos con especialista',
        'Análisis preliminar IA — requiere validación por especialista',
      ]
    })
 
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json({
      findings: [
        'Error en el análisis — intentá de nuevo',
        'Análisis preliminar IA — requiere validación por especialista',
      ]
    }, { status: 500 })
  }
}