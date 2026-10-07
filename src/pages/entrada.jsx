import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// E1: se já houver sessão, pula direto para o início do perfil.
export default function Entrada() {
  const { usuario, carregando, ehAdmin } = useAuth()
  if (carregando) return null
  if (usuario) return <Navigate to={ehAdmin ? '/admin' : '/'} replace />
  return (
    <section className="cartao estreito centro">
      <h1>Clínica Veterinária</h1>
      <p>Agende consultas e vacinas para o seu pet.</p>
      <div className="acoes">
        <Link className="botao" to="/entrar">Entrar</Link>
        <Link className="botao secundario" to="/cadastro">Criar conta</Link>
      </div>
    </section>
  )
}