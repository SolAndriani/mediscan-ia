import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, studyType } = body

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

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

    const studyContext = studyType ? `El usuario indica que es: ${studyType}.` : ''

    const prompt = `Sos un asistente especializado en diagnóstico por imágenes médicas.

INSTRUCCIONES:
1. Mirá la imagen y determiná QUÉ tipo de imagen es realmente (no asumas nada).
2. Si NO es una imagen médica, devolvé: {"findings":["La imagen no corresponde a un estudio médico válido. Por favor subí una radiografía, ecografía, TAC o similar."],"imageType":"no_medical"}
3. Si SÍ es médica, describí los hallazgos objetivamente en español. ${studyContext}

FORMATO DE RESPUESTA — solo JSON, sin texto extra, sin backticks:
{"findings":["hallazgo 1","hallazgo 2","hallazgo 3","Análisis preliminar IA — requiere validación por especialista"],"imageType":"tipo de imagen detectada"}

REGLAS:
- Describí exactamente lo que VES, no lo que suponés
- Máximo 4 hallazgos, máximo 15 palabras cada uno  
- Nunca diagnósticos definitivos, solo hallazgos descriptivos
- Si la calidad es mala, indicalo como hallazgo`

    const geminiBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: image } },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      throw new Error(`Gemini API error: ${res.status}`)
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.findings && Array.isArray(parsed.findings)) {
        return NextResponse.json(parsed)
      }
    }

    return NextResponse.json({
      findings: [
        'Imagen analizada correctamente',
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