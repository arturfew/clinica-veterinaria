import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, ORGANIZACAO } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Campo from '../components/Campo.jsx'

// E2: cria a conta de tutor e entra automaticamente.
export default function Cadastro() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const [f, setF] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await api.post('/auth/cadastro/', { organizacao: ORGANIZACAO, ...f }, { auth: false })
      await entrar(f.email, f.senha)
      navigate('/')
    } catch (err) {
      setErro(err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="cartao estreito">
      <h1>Criar conta</h1>
      <form onSubmit={enviar}>
        <Campo label="Nome" value={f.nome} onChange={muda('nome')} erros={erro?.campos?.nome} required />
        <Campo label="E-mail" type="email" value={f.email} onChange={muda('email')} erros={erro?.campos?.email} required />
        <Campo label="Senha" type="password" value={f.senha} onChange={muda('senha')} erros={erro?.campos?.senha || erro?.campos?.password} required />
        {erro?.geral?.map((m) => <p key={m} className="msg-erro" role="alert">{m}</p>)}
        {erro && !Object.keys(erro.campos || {}).length && !erro.geral?.length && (
          <p className="msg-erro" role="alert">{erro.message}</p>
        )}
        <button disabled={enviando}>{enviando ? 'Criando…' : 'Criar conta'}</button>
      </form>
      <p>Já tem conta? <Link to="/entrar">Entrar</Link></p>
    </section>
  )
}
