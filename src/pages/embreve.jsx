import { useAuth } from '../context/AuthContext.jsx'

// Tela provisória: cada página real substitui uma rota em App.jsx.
export default function EmBreve({ nome }) {
  const { usuario, sair } = useAuth()
  return (
    <section className="cartao">
      <h1>{nome}</h1>
      <p>Logado como {usuario?.nome || usuario?.email}. Tela em construção.</p>
      <button onClick={sair}>Sair</button>
    </section>
  )
}
