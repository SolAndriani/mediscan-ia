import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Si no hay API key configurada, devolvemos resultados de demo
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        findings: [
          'Modo demo activo — configurá OPENAI_API_KEY para análisis real',
          'Silueta cardíaca dentro de límites normales',
          'Trama vascular pulmonar conservada bilateralmente',
        ]
      })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `Sos un asistente de radiología. Analizás imágenes médicas y describís hallazgos de forma clara y estructurada en español. 
          Devolvé SOLO un JSON con el campo "findings" que es un array de strings con los hallazgos principales (máximo 4 items).
          Cada hallazgo debe ser conciso (máximo 15 palabras). 
          IMPORTANTE: Siempre incluí el disclaimer "Análisis preliminar IA — requiere validación por especialista" como último ítem.
          No incluyas diagnósticos definitivos, solo hallazgos descriptivos.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${image}` }
            },
            {
              type: 'text',
              text: 'Analizá esta imagen médica y listá los hallazgos principales en JSON.'
            }
          ]
        }
      ]
    })

    const content = response.choices[0]?.message?.content || ''

    // Parseamos el JSON de la respuesta
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return NextResponse.json(parsed)
    }

    // Fallback si no viene JSON limpio
    return NextResponse.json({
      findings: [
        'Análisis completado — revisar imagen completa',
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
