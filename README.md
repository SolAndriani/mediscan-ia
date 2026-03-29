# MediScan IA 🩺

Plataforma de segunda opinión diagnóstica por imagen asistida por IA para clínicas de Latinoamérica.

**Stack:** Next.js 14 · TypeScript · OpenAI Vision API · Vercel

---

## 🚀 Instalación local

```bash
# 1. Clonar el repo
git clone https://github.com/TU_USUARIO/mediscan-ia.git
cd mediscan-ia

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editá .env.local y agregá tu OPENAI_API_KEY

# 4. Correr en desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌐 Deploy en Vercel

### Opción A — Desde la web de Vercel (más fácil)

1. Subí el proyecto a GitHub
2. Entrá a [vercel.com](https://vercel.com) → "Add New Project"
3. Importá tu repo de GitHub
4. En "Environment Variables" agregá:
   - `OPENAI_API_KEY` = tu key de OpenAI
5. Hacé clic en "Deploy"

### Opción B — Desde la terminal

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Seguir las instrucciones del wizard
# Para producción:
vercel --prod
```

---

## ⚙️ Variables de entorno

| Variable | Descripción | Dónde conseguirla |
|---|---|---|
| `OPENAI_API_KEY` | Key para análisis de imágenes con IA | [platform.openai.com](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio | Vercel te la da automáticamente |

> **Sin OPENAI_API_KEY**: el sistema funciona en modo demo con hallazgos simulados. Perfecto para mostrar en LinkedIn.

---

## 📁 Estructura del proyecto

```
mediscan-ia/
├── src/
│   └── app/
│       ├── page.tsx              # Landing page
│       ├── layout.tsx            # Layout raíz
│       ├── globals.css           # Estilos globales
│       ├── dashboard/
│       │   ├── page.tsx          # Dashboard MVP
│       │   └── layout.tsx
│       └── api/
│           └── analyze/
│               └── route.ts      # API de análisis con IA
├── public/
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🔮 Próximos pasos

- [ ] Autenticación de clínicas (Clerk o Supabase Auth)
- [ ] Base de datos (Supabase PostgreSQL)
- [ ] Storage de imágenes (Cloudinary o AWS S3)
- [ ] Visor DICOM nativo (cornerstone.js)
- [ ] Sistema de notificaciones por email
- [ ] App mobile (React Native)

---

## ⚠️ Aviso legal

Esta plataforma es una herramienta de apoyo diagnóstico. **No reemplaza el criterio médico profesional.** Todos los análisis de IA deben ser validados por un especialista habilitado.

---

Hecho con ❤️ en Argentina 🇦🇷
