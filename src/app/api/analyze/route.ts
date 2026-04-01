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
          'Análisis preliminar IA — requiere validación por especialista',
        ]
      })
    }

    const prompt = `Sos un médico radiólogo experto. Analizá esta imagen médica con precisión clínica.

PASO 1 — Identificá el tipo de imagen:
Mirá la imagen y determiná si es: radiografía (RX), tomografía (TAC/TC), resonancia magnética (RMN/RM), ecografía/ultrasonido, mamografía, u otro tipo de imagen médica.
${studyType ? `El operador indica que es: ${studyType}.` : ''}

PASO 2 — Si NO es una imagen médica:
Devolvé exactamente: {"findings":["Imagen no válida: no corresponde a un estudio médico. Por favor subí una radiografía, TAC, ecografía o similar."],"imageType":"no_medical"}

PASO 3 — Si SÍ es una imagen médica, analizá y describí:
- Qué estructuras anatómicas se ven
- Si hay alteraciones, opacidades, lesiones, asimetrías o hallazgos relevantes
- El estado de las estructuras normales visibles
- Calidad técnica de la imagen si es relevante

FORMATO DE RESPUESTA OBLIGATORIO — devolvé SOLO este JSON, sin texto antes ni después, sin markdown, sin triple backticks:
{"findings":["hallazgo específico 1","hallazgo específico 2","hallazgo específico 3","Análisis preliminar IA — requiere validación por especialista médico"],"imageType":"tipo detectado"}

REGLAS ESTRICTAS:
- Cada hallazgo: máximo 12 palabras, lenguaje médico claro
- Describí lo que VES concretamente en ESTA imagen específica
- NO repitas frases genéricas que sirvan para cualquier imagen
- NO inventes estructuras que no puedas ver
- Máximo 4 hallazgos en total
- El último hallazgo SIEMPRE debe ser el aviso legal`

    const geminiBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: image } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.05,
        maxOutputTokens: 500,
      },
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error response:', err)
      throw new Error(`Gemini API error: ${res.status}`)
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.findings && Array.isArray(parsed.findings)) {
          return NextResponse.json(parsed)
        }
      } catch {
        console.error('JSON parse error:', jsonMatch[0])
      }
    }

    return NextResponse.json({
      findings: [
        'Imagen recibida y procesada',
        'No se pudo estructurar el análisis automáticamente',
        'Análisis preliminar IA — requiere validación por especialista médico',
      ]
    })

  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json({
      findings: [
        'Error en el análisis — intentá de nuevo',
        'Análisis preliminar IA — requiere validación por especialista médico',
      ]
    }, { status: 500 })
  }
}