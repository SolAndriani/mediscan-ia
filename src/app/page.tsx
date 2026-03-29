'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#1a1a1a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fraunces { font-family: 'Fraunces', serif; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fillBar { from{width:0} to{width:94%} }
        @keyframes markerPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,159,39,.4)} 50%{box-shadow:0 0 0 8px rgba(239,159,39,0)} }
        .pulse-dot::before { content:''; display:inline-block; width:7px; height:7px; background:#1D9E75; border-radius:50%; animation:pulse 2s infinite; margin-right:8px; }
        .float-badge { animation: float 3s ease-in-out infinite; }
        .confidence-fill { animation: fillBar 2s ease 0.5s both; }
        .marker { animation: markerPulse 2s infinite; }
        .btn-primary { background:#0F6E56; color:#fff; padding:.85rem 2rem; border-radius:100px; font-size:.95rem; font-weight:500; text-decoration:none; border:none; cursor:pointer; transition:background .2s; display:inline-block; }
        .btn-primary:hover { background:#085041; }
        .btn-ghost-dark { color:#1a1a1a; font-size:.95rem; text-decoration:none; display:inline-flex; align-items:center; gap:.4rem; transition:gap .2s; }
        .btn-ghost-dark:hover { gap:.7rem; }
        nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:1rem 4%; display:flex; align-items:center; justify-content:space-between; background:rgba(247,244,238,.9); backdrop-filter:blur(12px); border-bottom:1px solid rgba(15,110,86,.12); }
        .nav-links a { text-decoration:none; color:#555; font-size:.9rem; margin-left:2rem; transition:color .2s; }
        .nav-links a:hover { color:#0F6E56; }
        .nav-cta { background:#0F6E56; color:#fff !important; padding:.45rem 1.2rem; border-radius:100px; font-weight:500 !important; }
        .feature-card { background:#fff; border-radius:16px; padding:2rem; border:1px solid #EDE9DF; transition:transform .2s, box-shadow .2s; }
        .feature-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,.07); }
        .pricing-card { background:#fff; border-radius:20px; padding:2rem; border:1px solid #EDE9DF; display:flex; flex-direction:column; }
        .pricing-card.featured { background:#0F6E56; border-color:#0F6E56; transform:scale(1.03); }
        .plan-btn { display:block; text-align:center; padding:.85rem; border-radius:100px; font-size:.9rem; font-weight:500; text-decoration:none; cursor:pointer; border:1.5px solid #0F6E56; color:#0F6E56; background:transparent; transition:all .2s; }
        .plan-btn:hover { background:#0F6E56; color:#fff; }
        .plan-btn.featured-btn { background:#fff; color:#0F6E56; border-color:#fff; }
        .testimonial-card { background:#fff; border-radius:16px; padding:1.8rem; border:1px solid #EDE9DF; }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important}
          .steps-grid{grid-template-columns:1fr!important}
          .features-grid{grid-template-columns:1fr!important}
          .pricing-grid{grid-template-columns:1fr!important}
          .pricing-card.featured{transform:scale(1)!important}
          .testimonials-grid{grid-template-columns:1fr!important}
          .nav-links{display:none}
          .hero-visual{display:none}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="fraunces" style={{ fontSize:'1.4rem', fontWeight:600, color:'#0F6E56', letterSpacing:'-.02em' }}>
          Medi<span style={{ color:'#1a1a1a' }}>Scan</span> IA
        </div>
        <div className="nav-links">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#precios">Precios</a>
          <Link href="/dashboard" className="nav-cta" style={{ marginLeft:'2rem', textDecoration:'none', color:'#fff' }}>Solicitar demo</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ paddingTop:'5rem', background:'#F7F4EE' }}>
        <div className="hero-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'6rem 4% 5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
          <div>
            <div className="pulse-dot" style={{ display:'inline-flex', alignItems:'center', background:'#E1F5EE', color:'#0F6E56', fontSize:'.8rem', fontWeight:500, padding:'.35rem .9rem', borderRadius:'100px', border:'1px solid #5DCAA5', marginBottom:'1.5rem', letterSpacing:'.04em', textTransform:'uppercase' }}>
              IA médica para LATAM
            </div>
            <h1 className="fraunces" style={{ fontSize:'clamp(2.8rem,5vw,4rem)', fontWeight:600, lineHeight:1.1, letterSpacing:'-.03em', marginBottom:'1.5rem' }}>
              Segunda opinión diagnóstica{' '}
              <em style={{ fontStyle:'italic', color:'#0F6E56' }}>en minutos,</em>{' '}
              no en días
            </h1>
            <p style={{ fontSize:'1.1rem', color:'#555', lineHeight:1.7, maxWidth:520, marginBottom:'2.5rem' }}>
              Subís la imagen médica, nuestra IA la analiza y una red de especialistas la valida.
              Para clínicas independientes de Latinoamérica.
            </p>
            <div style={{ display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap' }}>
              <Link href="/dashboard" className="btn-primary">Probar demo gratuita →</Link>
              <a href="#como-funciona" className="btn-ghost-dark">Ver cómo funciona →</a>
            </div>
            <div style={{ display:'flex', gap:'2.5rem', marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid #EDE9DF' }}>
              {[['94%','Precisión diagnóstica'],['< 8 min','Tiempo de respuesta'],['DICOM','Compatible nativamente']].map(([n,l])=>(
                <div key={l}>
                  <div className="fraunces" style={{ fontSize:'2rem', fontWeight:600, color:'#0F6E56', lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:'.8rem', color:'#555', marginTop:'.3rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SCAN MOCKUP */}
          <div className="hero-visual" style={{ position:'relative' }}>
            <div style={{ background:'#04232E', borderRadius:20, overflow:'hidden' }}>
              <div style={{ padding:'1.2rem 1.5rem', display:'flex', alignItems:'center', gap:'0.5rem', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
                {['#FF5F56','#FFBD2E','#27C93F'].map(c=><div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
                <span style={{ marginLeft:'auto', fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontFamily:'monospace' }}>RX_torax_001.dcm</span>
              </div>
              <div style={{ padding:'1.5rem', position:'relative' }}>
                <div style={{ background:'#060f14', borderRadius:10, aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                  <svg viewBox="0 0 400 300" style={{ width:'100%', height:'100%', opacity:.85 }}>
                    <rect width="400" height="300" fill="#0d1b22"/>
                    <g stroke="rgba(180,220,200,0.25)" strokeWidth="1.5" fill="none">
                      <ellipse cx="200" cy="150" rx="130" ry="120"/>
                      <path d="M 100 80 Q 80 130 85 160 Q 90 190 100 200"/>
                      <path d="M 300 80 Q 320 130 315 160 Q 310 190 300 200"/>
                      <path d="M 95 100 Q 75 110 70 130"/><path d="M 305 100 Q 325 110 330 130"/>
                      <path d="M 88 120 Q 65 132 60 155"/><path d="M 312 120 Q 335 132 340 155"/>
                      <path d="M 86 140 Q 62 154 60 178"/><path d="M 314 140 Q 338 154 340 178"/>
                    </g>
                    <rect x="193" y="40" width="14" height="230" rx="4" fill="rgba(200,220,210,0.15)"/>
                    <ellipse cx="155" cy="160" rx="65" ry="85" fill="rgba(100,180,150,0.07)"/>
                    <ellipse cx="245" cy="160" rx="65" ry="85" fill="rgba(100,180,150,0.07)"/>
                    <ellipse cx="185" cy="170" rx="35" ry="42" fill="rgba(150,170,160,0.15)"/>
                    <ellipse cx="255" cy="130" rx="22" ry="18" fill="rgba(255,190,50,0.08)" stroke="rgba(255,190,50,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
                  </svg>
                  <div style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(29,158,117,.15)', border:'1px solid rgba(29,158,117,.4)', borderRadius:10, padding:'.6rem .9rem' }}>
                    <div style={{ fontSize:'.7rem', color:'#5DCAA5', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>Análisis IA</div>
                    <div style={{ fontSize:'.85rem', color:'#fff', fontWeight:500 }}>Posible opacidad LSD</div>
                    <div style={{ marginTop:'.4rem', height:3, background:'rgba(255,255,255,.1)', borderRadius:10, overflow:'hidden' }}>
                      <div className="confidence-fill" style={{ height:'100%', background:'#5DCAA5', borderRadius:10, width:'94%' }}/>
                    </div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem', marginTop:'1rem' }}>
                  {[['Silueta cardíaca','Normal','#5DCAA5'],['Zona marcada','Revisar','#FFBD2E'],['Confianza','94%','#5DCAA5'],['Especialista','Asignado','#5DCAA5']].map(([l,v,c])=>(
                    <div key={l} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:8, padding:'.6rem .8rem' }}>
                      <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'.2rem' }}>{l}</div>
                      <div style={{ fontSize:'.8rem', color:c, fontWeight:500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="float-badge" style={{ position:'absolute', bottom:'-1.5rem', left:'-1.5rem', background:'#fff', borderRadius:14, padding:'1rem 1.2rem', boxShadow:'0 20px 60px rgba(0,0,0,.12)', display:'flex', alignItems:'center', gap:'.8rem' }}>
              <div style={{ width:36, height:36, background:'#E1F5EE', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🩺</div>
              <div>
                <div style={{ fontSize:'.85rem', fontWeight:500 }}>Dr. Ramírez validó el informe</div>
                <div style={{ fontSize:'.7rem', color:'#555' }}>Hace 3 minutos · Rosario, Argentina</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="como-funciona" style={{ background:'#04232E', padding:'5rem 4%' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ fontSize:'.75rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#5DCAA5', marginBottom:'1rem' }}>Proceso</div>
          <h2 className="fraunces" style={{ fontSize:'clamp(2rem,3.5vw,2.8rem)', fontWeight:600, letterSpacing:'-.03em', color:'#fff', marginBottom:'1.25rem' }}>
            Tres pasos. <em style={{ fontStyle:'italic', color:'#5DCAA5' }}>Sin fricción.</em>
          </h2>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginTop:'3rem' }}>
            {[
              ['01','Subís la imagen','Cargás el archivo DICOM, JPEG o PNG. Compatible con RX, TAC, ecografías y mamografías. Sin instalación de software.'],
              ['02','La IA analiza al instante','Nuestro modelo identifica hallazgos, los marca en la imagen y genera un pre-informe en menos de 3 minutos.'],
              ['03','El especialista valida','Un radiólogo de nuestra red revisa, corrige si es necesario y emite el informe firmado digitalmente.'],
            ].map(([n,t,d])=>(
              <div key={n} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:'2rem' }}>
                <div className="fraunces" style={{ fontSize:'3rem', fontWeight:300, color:'rgba(93,202,165,.25)', lineHeight:1, marginBottom:'1.2rem' }}>{n}</div>
                <h3 style={{ fontSize:'1rem', fontWeight:500, color:'#fff', marginBottom:'.6rem' }}>{t}</h3>
                <p style={{ fontSize:'.88rem', color:'rgba(255,255,255,.45)', lineHeight:1.65 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="precios" style={{ background:'#EDE9DF', padding:'5rem 4%' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ fontSize:'.75rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#0F6E56', marginBottom:'1rem' }}>Precios</div>
          <h2 className="fraunces" style={{ fontSize:'clamp(2rem,3.5vw,2.8rem)', fontWeight:600, letterSpacing:'-.03em', marginBottom:'1.25rem' }}>
            Transparente. <em style={{ fontStyle:'italic', color:'#0F6E56' }}>Sin sorpresas.</em>
          </h2>
          <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginTop:'3rem', alignItems:'center' }}>
            {[
              { name:'Starter', price:'$199', period:'por mes · 50 estudios', features:['Análisis IA para RX y ecografías','Red de especialistas incluida','Informes en 24 horas','Soporte por email','1 usuario'], featured:false },
              { name:'Clínica', price:'$499', period:'por mes · 200 estudios', features:['Todo el plan Starter','TAC y resonancias incluidas','Informes en 8 horas','Soporte prioritario','5 usuarios + API'], featured:true },
              { name:'Enterprise', price:'Custom', period:'estudios ilimitados', features:['Todo el plan Clínica','Integración HIS/RIS a medida','SLA garantizado','Gerente de cuenta','Usuarios ilimitados'], featured:false },
            ].map(p=>(
              <div key={p.name} className={`pricing-card${p.featured?' featured':''}`}>
                <div style={{ fontSize:'.75rem', fontWeight:500, textTransform:'uppercase', letterSpacing:'.1em', color: p.featured?'rgba(255,255,255,.6)':'#555', marginBottom:'1rem' }}>{p.name}</div>
                <div className="fraunces" style={{ fontSize:'2.8rem', fontWeight:600, color:p.featured?'#fff':'#1a1a1a', lineHeight:1, marginBottom:'.3rem' }}>{p.price}</div>
                <div style={{ fontSize:'.8rem', color:p.featured?'rgba(255,255,255,.5)':'#555', marginBottom:'1.5rem' }}>{p.period}</div>
                <ul style={{ listStyle:'none', flex:1, marginBottom:'1.5rem' }}>
                  {p.features.map(f=>(
                    <li key={f} style={{ fontSize:'.88rem', color:p.featured?'rgba(255,255,255,.7)':'#555', padding:'.5rem 0', borderBottom:`1px solid ${p.featured?'rgba(255,255,255,.12)':'#EDE9DF'}`, display:'flex', alignItems:'center', gap:'.6rem' }}>
                      <span style={{ color:p.featured?'#5DCAA5':'#1D9E75' }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className={`plan-btn${p.featured?' featured-btn':''}`} style={{ textDecoration:'none' }}>
                  {p.name === 'Enterprise' ? 'Hablar con ventas' : 'Empezar gratis'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:'#04232E', padding:'6rem 4%', textAlign:'center' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <div style={{ fontSize:'.75rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'#5DCAA5', marginBottom:'1rem' }}>Empezá hoy</div>
          <h2 className="fraunces" style={{ fontSize:'clamp(2rem,3.5vw,2.8rem)', fontWeight:600, color:'#fff', marginBottom:'1rem', letterSpacing:'-.03em' }}>
            Tu clínica merece diagnósticos <em style={{ fontStyle:'italic', color:'#5DCAA5' }}>de primer nivel</em>
          </h2>
          <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.5)', marginBottom:'2.5rem' }}>
            30 días gratis. Sin tarjeta de crédito. Configuración en menos de 24 horas.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/dashboard" style={{ background:'#fff', color:'#0F6E56', padding:'.85rem 2rem', borderRadius:'100px', fontSize:'.95rem', fontWeight:500, textDecoration:'none' }}>
              Ver demo del dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#020f14', padding:'2.5rem 4%', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div className="fraunces" style={{ fontSize:'1.1rem', color:'rgba(255,255,255,.5)' }}>
          Medi<span style={{ color:'#5DCAA5' }}>Scan</span> IA
        </div>
        <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.25)' }}>© 2025 MediScan IA · Hecho en Argentina 🇦🇷</p>
        <div style={{ display:'flex', gap:'1.5rem' }}>
          {['Privacidad','Términos','Contacto'].map(l=>(
            <a key={l} href="#" style={{ fontSize:'.8rem', color:'rgba(255,255,255,.3)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
