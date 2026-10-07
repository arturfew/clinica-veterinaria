import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Campo from '../components/Campo.jsx'

export default function Login() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      const eu = await entrar(email, senha)
      navigate(eu.permissoes?.includes('api.change_organizacao') ? '/admin' : '/')
    } catch (err) {
      setErro(err.status === 400 ? { message: 'Organização, e-mail ou senha inválidos' } : err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="cartao estreito">
      <h1>Entrar</h1>
      <form onSubmit={enviar}>
        <Campo label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Campo label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        {erro && <p className="msg-erro" role="alert">{erro.message}</p>}
        <button disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      </form>
      <p><Link to="/cadastro">Criar conta</Link> · <Link to="/esqueci-senha">Esqueci minha senha</Link></p>
    </section>
  )
}
