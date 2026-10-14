import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Ícones do Bootstrap (bi bi-...). Mantemos só a fonte de ícones.
import 'bootstrap-icons/font/bootstrap-icons.css'
// CSS do HeroUI (obrigatório). O HeroUI v3 não expõe mais o <HeroUIProvider>
// (isso era do v2) e não injeta CSS via JS: os estilos vêm deste import,
// que também traz o Tailwind CSS v4 e o tema do HeroUI.
import './heroui.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Nenhum provider do HeroUI é necessário. */}
    <App />
  </StrictMode>,
)
