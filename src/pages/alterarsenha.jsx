import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import Campo from '../components/Campo.jsx'

// E6: a confirmação da nova senha é conferida só no app.
export default function AlterarSenha() {
  const navigate = useNavigate()
  const [f, setF] = useState({ senha_atual: '', nova_senha: '', confirma: '' })
  const [erro, setErro] = useState(null)
  const [local, setLocal] = useState('')
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    setLocal('')
    if (f.nova_senha !== f.confirma) return setLocal('A confirmação não confere com a nova senha')
    try {
      await api.post('/auth/alterar-senha/', { senha_atual: f.senha_atual, nova_senha: f.nova_senha })
      navigate('/perfil', { state: { aviso: 'Senha alterada' } })
    } catch (err) {
      setErro(err)
    }
  }

  return (
    <section className="cartao estreito">
      <h1>Alterar senha</h1>
      <form onSubmit={enviar}>
        <Campo label="Senha atual" type="password" value={f.senha_atual} onChange={muda('senha_atual')} erros={erro?.campos?.senha_atual} required />
        <Campo label="Nova senha" type="password" value={f.nova_senha} onChange={muda('nova_senha')} erros={erro?.campos?.nova_senha} required />
        <Campo label="Confirmar nova senha" type="password" value={f.confirma} onChange={muda('confirma')} required />
        {local && <p className="msg-erro" role="alert">{local}</p>}
        {erro && !Object.keys(erro.campos).length && <p className="msg-erro" role="alert">{erro.message}</p>}
        <button>Salvar</button>
      </form>
      <p><Link to="/perfil">Cancelar</Link></p>
    </section>
  )
}
