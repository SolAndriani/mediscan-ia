'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

type StudyStatus = 'done' | 'analyzing' | 'pending' | 'review'

interface Study {
  id: number
  name: string
  age: number | string
  type: string
  status: StudyStatus
  date: string
  conf: string
  findings?: string[]
  imageUrl?: string
}

const initialStudies: Study[] = [
  { id:1, name:'García, M.L.', age:52, type:'RX Tórax', status:'done', date:'Hoy 10:23', conf:'94%', findings:['Opacidad lóbulo superior derecho — 2.3 cm','Silueta cardíaca de tamaño normal','Trama vascular pulmonar conservada'] },
  { id:2, name:'López, R.', age:38, type:'TAC Abdomen', status:'analyzing', date:'Hoy 11:05', conf:'—', findings:[] },
  { id:3, name:'Fernández, C.', age:65, type:'Ecografía', status:'pending', date:'Hoy 11:30', conf:'—', findings:[] },
  { id:4, name:'Torres, A.', age:44, type:'Mamografía', status:'review', date:'Ayer 16:40', conf:'71%', findings:['Microcalcificaciones región central','Nódulo 8mm cuadrante superoexterno'] },
  { id:5, name:'Romero, P.', age:29, type:'RX Columna', status:'done', date:'Ayer 15:10', conf:'97%', findings:['Sin alteraciones estructurales','Espacios intervertebrales conservados'] },
]

const statusMap = {
  done: { label:'Listo', color:'var(--green)', bg:'var(--green-dim)' },
  analyzing: { label:'Analizando...', color:'var(--teal-light)', bg:'var(--teal-dim)' },
  pending: { label:'En espera', color:'var(--amber)', bg:'var(--amber-dim)' },
  review: { label:'Revisar', color:'var(--red)', bg:'var(--red-dim)' },
}

export default function Dashboard() {
  const [studies, setStudies] = useState<Study[]>(initialStudies)
  const [selected, setSelected] = useState(0)
  const [modal, setModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(-1)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<string[]>([])
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [notification, setNotification] = useState<{icon:string,text:string}|null>(null)
  const [form, setForm] = useState({ name:'', age:'', type:'RX Tórax', notes:'' })
  const fileRef = useRef<HTMLInputElement>(null)

  const showNotif = (icon: string, text: string) => {
    setNotification({ icon, text })
    setTimeout(() => setNotification(null), 3500)
  }

  const simulateUpload = async (filename: string, imageBase64: string, imageObjectUrl: string) => {
    setUploading(true)
    setAiResult([])
    setCurrentImageUrl(imageObjectUrl)

    const steps = ['Cargando imagen...','Preprocesando...','Analizando con IA...','Finalizando...']
    for (let i = 0; i < steps.length; i++) {
      setUploadStep(i)
      await new Promise(r => setTimeout(r, 1000))
    }
    setUploadStep(-1)
    setUploading(false)
    setAnalyzing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, studyType: form.type })
      })
      const data = await res.json()
      if (data.findings) setAiResult(data.findings)
    } catch {
      setAiResult(['No se pudo conectar con la IA. Verificá tu conexión.'])
    }
    setAnalyzing(false)

    const newStudy: Study = {
      id: Date.now(),
      name: form.name || 'Nuevo paciente',
      age: form.age || '—',
      type: form.type || 'RX Tórax',
      status: 'done',
      date: 'Ahora',
      conf: '92%',
      findings: aiResult,
      imageUrl: imageObjectUrl,
    }
    setStudies(prev => [newStudy, ...prev])
    setSelected(0)
    showNotif('🩺', 'Análisis completado por Gemini IA')
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1]
      simulateUpload(file.name, base64, objectUrl)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1]
      simulateUpload(file.name, base64, objectUrl)
    }
    reader.readAsDataURL(file)
  }

  const createStudy = () => {
    const s: Study = {
      id: Date.now(),
      name: form.name || 'Nuevo paciente',
      age: form.age || '—',
      type: form.type,
      status: 'pending',
      date: 'Ahora',
      conf: '—',
      findings: []
    }
    setStudies(prev => [s, ...prev])
    setModal(false)
    setForm({ name:'', age:'', type:'RX Tórax', notes:'' })
    showNotif('✅', `Estudio de ${s.name} creado`)
  }

  const handleSelectRow = (i: number) => {
    setSelected(i)
    setAiResult([])
    const study = studies[i]
    if (study.imageUrl) {
      setCurrentImageUrl(study.imageUrl)
    } else {
      setCurrentImageUrl(null)
    }
  }

  const current = studies[selected]
  const displayFindings = aiResult.length > 0 ? aiResult : (current?.findings || [])

  const S = {
    sidebar: { width:220, flexShrink:0, background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column' as const, padding:'1.5rem 1rem', gap:'.25rem' },
    navItem: (active:boolean) => ({ display:'flex', alignItems:'center', gap:'.7rem', padding:'.65rem .75rem', borderRadius:8, color: active?'var(--teal-light)':'var(--text2)', fontSize:'.85rem', cursor:'pointer', background: active?'var(--teal-dim)':'transparent', border:`1px solid ${active?'var(--border2)':'transparent'}`, transition:'all .15s' }),
    card: { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' as const },
    cardHeader: { padding:'1rem 1.25rem .75rem', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' },
    cardTitle: { fontSize:'.8rem', fontWeight:500, color:'var(--text2)', textTransform:'uppercase' as const, letterSpacing:'.07em' },
    btn: (variant:'teal'|'ghost') => ({ display:'inline-flex', alignItems:'center', gap:'.4rem', padding:'.5rem 1rem', borderRadius:6, fontSize:'.82rem', fontWeight:500, fontFamily:'inherit', cursor:'pointer', border: variant==='ghost'?'1px solid var(--border)':'none', background: variant==='teal'?'var(--teal)':'transparent', color: variant==='teal'?'#fff':'var(--text2)', transition:'all .15s' }),
    tag: (color:'gray'|'teal'|'amber') => {
      const map = {
        gray:{ background:'rgba(255,255,255,.04)', color:'var(--text2)', border:'1px solid var(--border)' },
        teal:{ background:'var(--teal-dim)', color:'var(--teal-light)', border:'1px solid var(--border2)' },
        amber:{ background:'var(--amber-dim)', color:'var(--amber)', border:'none' }
      }
      return { fontSize:'.68rem', padding:'.2rem .6rem', borderRadius:100, fontWeight:500, textTransform:'uppercase' as const, letterSpacing:'.05em', ...map[color] }
    },
  }

  const uploadSteps = ['Cargando imagen...','Preprocesando...','Analizando con IA...','Finalizando...']

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'DM Sans',sans-serif" }}>

      <aside style={S.sidebar}>
        <Link href="/" style={{ fontFamily:"'Fraunces',serif", fontSize:'1.2rem', fontWeight:500, color:'var(--teal-light)', textDecoration:'none', letterSpacing:'-.02em', marginBottom:'2rem', display:'block' }}>
          Medi<span style={{ color:'var(--text)' }}>Scan</span> IA
        </Link>
        {[['🏠','Dashboard'],['📁','Mis estudios'],['📋','Informes'],['👥','Especialistas'],['📊','Analítica'],['⚙️','Configuración']].map(([icon,label],i)=>(
          <div key={label} style={S.navItem(i===0)}><span>{icon}</span>{label}</div>
        ))}
        <div style={{ marginTop:'auto', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem', padding:'.6rem .75rem' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--teal-dim)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:500, color:'var(--teal-light)', flexShrink:0 }}>CP</div>
            <div>
              <div style={{ fontSize:'.82rem', color:'var(--text2)' }}>Clínica Previsor</div>
              <div style={{ fontSize:'.7rem', color:'var(--text3)' }}>Plan Clínica · 87/200</div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        <div style={{ height:56, flexShrink:0, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 1.5rem', gap:'1rem' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1rem', fontWeight:500, color:'var(--text)', flex:1 }}>Dashboard</div>
          <button style={S.btn('ghost')} onClick={() => setModal(true)}>+ Nuevo paciente</button>
          <button style={S.btn('teal')} onClick={() => fileRef.current?.click()}>⬆ Subir imagen</button>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.dcm" style={{ display:'none' }} onChange={handleFile}/>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', gap:'1.5rem' }}>

          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'1.25rem', minWidth:0 }}>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
              {[
                ['Estudios este mes','87','var(--teal-light)','↑ 12% vs mes anterior'],
                ['En análisis','3','var(--amber)','Promedio: 6 min'],
                ['Informes listos','81','var(--text)','93% completitud'],
                ['Precisión IA','96%','var(--teal-light)','Validado por especialistas'],
              ].map(([l,n,c,d])=>(
                <div key={l} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem 1.25rem' }}>
                  <div style={{ fontSize:'.72rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.5rem' }}>{l}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.8rem', fontWeight:500, color:c, lineHeight:1, marginBottom:'.3rem' }}>{n}</div>
                  <div style={{ fontSize:'.72rem', color:'var(--text3)' }}>{d}</div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Subir imagen</div>
                <span style={S.tag('teal')}>DICOM · JPG · PNG</span>
              </div>
              {!uploading ? (
                <div style={{ padding:'1rem 1.25rem' }}>
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{ border:'1.5px dashed var(--border2)', borderRadius:10, padding:'2rem', textAlign:'center', cursor:'pointer', background:'rgba(29,158,117,.05)', transition:'all .2s' }}
                  >
                    <div style={{ fontSize:'2rem', marginBottom:'.75rem', opacity:.6 }}>🩻</div>
                    <div style={{ fontSize:'.9rem', fontWeight:500, color:'var(--text)', marginBottom:'.3rem' }}>Arrastrá la imagen aquí o hacé clic</div>
                    <div style={{ fontSize:'.78rem', color:'var(--text3)' }}>JPEG y PNG hasta 50 MB</div>
                    <div style={{ display:'flex', gap:'.5rem', justifyContent:'center', marginTop:'1rem', flexWrap:'wrap' }}>
                      {['RX Tórax','TAC','Ecografía','Mamografía','RMN'].map(t=>(
                        <span key={t} style={S.tag('gray')}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:'.75rem' }}>
                  {uploadSteps.map((step, i) => {
                    const done = i < uploadStep
                    const active = i === uploadStep
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:'.75rem', fontSize:'.82rem' }}>
                        <div style={{
                          width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'.7rem', flexShrink:0,
                          background: done?'var(--green-dim)': active?'var(--teal-dim)':'var(--bg4)',
                          color: done?'var(--green)': active?'var(--teal-light)':'var(--text3)',
                          opacity: active ? 1 : done ? 1 : 0.4
                        }}>
                          {done ? '✓' : i+1}
                        </div>
                        <div style={{ color: active?'var(--text)':'var(--text3)', textDecoration: done?'line-through':'none' }}>{step}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div style={{ ...S.card, flex:1 }}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Estudios recientes</div>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Paciente','Tipo','Estado','Fecha','Confianza'].map(h=>(
                      <th key={h} style={{ textAlign:'left', fontSize:'.68rem', color:'var(--text3)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.07em', padding:'.6rem 1.25rem', borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {studies.map((s,i) => {
                    const st = statusMap[s.status]
                    return (
                      <tr key={s.id} onClick={() => handleSelectRow(i)}
                        style={{ borderBottom:'1px solid var(--border)', cursor:'pointer', background: i===selected?'var(--teal-dim)':'transparent', transition:'background .12s' }}>
                        <td style={{ padding:'.75rem 1.25rem', fontSize:'.82rem' }}>
                          <div style={{ fontWeight:500, color:'var(--text)' }}>{s.name}</div>
                          <div style={{ fontSize:'.7rem', color:'var(--text3)', marginTop:'.1rem' }}>{s.age} años</div>
                        </td>
                        <td style={{ padding:'.75rem 1.25rem' }}><span style={S.tag('gray')}>{s.type}</span></td>
                        <td style={{ padding:'.75rem 1.25rem' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', fontSize:'.75rem', padding:'.25rem .65rem', borderRadius:100, background:st.bg, color:st.color }}>
                            <span style={{ width:5, height:5, borderRadius:'50%', background:st.color, display:'inline-block' }}/>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding:'.75rem 1.25rem', fontSize:'.75rem', color:'var(--text3)' }}>{s.date}</td>
                        <td style={{ padding:'.75rem 1.25rem', fontSize:'.82rem', fontWeight:500, color: s.conf!=='—'?'var(--teal-light)':'var(--text3)' }}>{s.conf}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ width:340, flexShrink:0, display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Visor de imagen</div>
                <span style={S.tag('amber')}>{current?.type || 'Sin estudio'}</span>
              </div>

              <div style={{ position:'relative', margin:'1rem 1.25rem', borderRadius:8, aspectRatio:'4/3', overflow:'hidden', background:'#060f14' }}>
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Imagen médica"
                    style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }}
                  />
                ) : (
                  <svg viewBox="0 0 320 240" style={{ width:'100%', height:'100%' }}>
                    <rect width="320" height="240" fill="#060f14"/>
                    <g stroke="rgba(160,210,185,0.2)" strokeWidth="1.2" fill="none">
                      <ellipse cx="160" cy="120" rx="105" ry="95"/>
                      <path d="M 75 65 Q 58 105 62 130 Q 66 155 75 162"/>
                      <path d="M 245 65 Q 262 105 258 130 Q 254 155 245 162"/>
                    </g>
                    <rect x="153" y="28" width="11" height="185" rx="3" fill="rgba(180,210,195,0.12)"/>
                    <ellipse cx="122" cy="128" rx="52" ry="68" fill="rgba(80,150,120,0.06)"/>
                    <ellipse cx="198" cy="128" rx="52" ry="68" fill="rgba(80,150,120,0.06)"/>
                    <text x="160" y="210" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="sans-serif">Subí una imagen para verla acá</text>
                  </svg>
                )}
                {analyzing && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(6,15,20,.75)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem' }}>
                    <div style={{ fontSize:'1.5rem' }}>🔬</div>
                    <div style={{ fontSize:'.85rem', color:'var(--teal-light)', fontWeight:500 }}>Gemini analizando...</div>
                  </div>
                )}
              </div>

              <div style={{ padding:'0 1.25rem 1rem', display:'flex', flexDirection:'column', gap:'.5rem' }}>
                {displayFindings.length > 0 ? (
                  displayFindings.map((f,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'.6rem', padding:'.65rem .75rem', background:'var(--bg3)', borderRadius:8, border:'1px solid var(--border)' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background: i===0?'var(--amber)':'var(--green)', flexShrink:0, marginTop:5 }}/>
                      <div style={{ fontSize:'.8rem', color:'var(--text2)', lineHeight:1.5 }}>{f}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize:'.8rem', color:'var(--text3)', padding:'.5rem', textAlign:'center' }}>
                    Subí una imagen para ver los hallazgos
                  </div>
                )}
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>Informe</div>
                <button style={{ ...S.btn('ghost'), fontSize:'.72rem', padding:'.3rem .65rem' }} onClick={() => showNotif('⬇','Informe descargado')}>⬇ PDF</button>
              </div>
              <div style={{ margin:'0 1.25rem 1rem', display:'flex', alignItems:'center', gap:'.7rem', padding:'.7rem .9rem', background:'var(--teal-dim)', border:'1px solid var(--border2)', borderRadius:8 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.68rem', fontWeight:500, color:'#fff', flexShrink:0 }}>JR</div>
                <div>
                  <div style={{ fontSize:'.82rem', fontWeight:500, color:'var(--teal-light)' }}>Dr. Jorge Ramírez</div>
                  <div style={{ fontSize:'.7rem', color:'var(--text3)' }}>Radiólogo · MN 12.450</div>
                </div>
              </div>
              <div style={{ padding:'0 1.25rem 1rem', fontSize:'.8rem', color:'var(--text2)', lineHeight:1.8 }}>
                <div style={{ fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'.4rem' }}>Paciente</div>
                <p>{current?.name || '—'} · {current?.age} años · {current?.type}</p>
                <div style={{ fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', margin:'.8rem 0 .4rem' }}>Hallazgos IA</div>
                <p>{displayFindings.length > 0 ? displayFindings.slice(0,-1).join('. ') + '.' : 'Pendiente de análisis.'}</p>
                <div style={{ marginTop:'.8rem', padding:'.6rem .75rem', background:'var(--amber-dim)', borderRadius:6, border:'1px solid rgba(239,159,39,.2)' }}>
                  <p style={{ color:'var(--amber)', fontSize:'.75rem' }}>⚠ Análisis preliminar IA — requiere validación por especialista médico.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(6,15,20,.85)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:16, width:480, maxWidth:'95vw', padding:'2rem' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.2rem', fontWeight:500, marginBottom:'1.5rem', color:'var(--text)' }}>Nuevo estudio</div>
            {[['Nombre del paciente','text','name','García, María Laura'],['Edad','number','age','52']].map(([label,type,key,ph])=>(
              <div key={key} style={{ marginBottom:'1rem' }}>
                <label style={{ fontSize:'.75rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.4rem', display:'block' }}>{label}</label>
                <input type={type} placeholder={ph} value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))}
                  style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:7, padding:'.6rem .85rem', fontSize:'.85rem', fontFamily:'inherit', color:'var(--text)', outline:'none' }}/>
              </div>
            ))}
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ fontSize:'.75rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.4rem', display:'block' }}>Tipo de estudio</label>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}
                style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:7, padding:'.6rem .85rem', fontSize:'.85rem', fontFamily:'inherit', color:'var(--text)', outline:'none' }}>
                {['RX Tórax','TAC Abdomen','Ecografía Abdominal','Mamografía','RMN Columna','RX Mano','RX Pie','RX Columna'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end', marginTop:'1.5rem' }}>
              <button style={S.btn('ghost')} onClick={() => setModal(false)}>Cancelar</button>
              <button style={S.btn('teal')} onClick={createStudy}>Crear estudio</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:10, padding:'.9rem 1.2rem', display:'flex', alignItems:'center', gap:'.7rem', fontSize:'.82rem', color:'var(--text)', zIndex:300, boxShadow:'0 8px 32px rgba(0,0,0,.3)' }}>
          <span>{notification.icon}</span>
          <span>{notification.text}</span>
        </div>
      )}
    </div>
  )
}