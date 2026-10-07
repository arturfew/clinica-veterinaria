import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ORGANIZACAO } from '../services/api.js'
import Campo from '../components/Campo.jsx'

// E4: a resposta é sempre a mesma, exista ou não o e-mail.
export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    try {
      await api.post('/auth/redefinir-senha/', { organizacao: ORGANIZACAO, email }, { auth: false })
      setEnviado(true)
    } catch (err) {
      setErro(err)
    }
  }

  return (
    <section className="cartao estreito">
      <h1>Esqueci minha senha</h1>
      {enviado ? (
        <p className="sucesso">Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.</p>
      ) : (
        <form onSubmit={enviar}>
          <Campo label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {erro && <p className="msg-erro" role="alert">{erro.message}</p>}
          <button>Enviar link</button>
        </form>
      )}
      <p><Link to="/entrar">Voltar para o login</Link></p>
    </section>
  )
}
