import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Campo from '../components/Campo.jsx'

// E5: ver/editar nome e foto (multipart) e sair.
export default function Perfil() {
  const { usuario, carregarUsuario, sair } = useAuth()
  const navigate = useNavigate()
  const aviso = useLocation().state?.aviso
  const [nome, setNome] = useState(usuario.nome || '')
  const [foto, setFoto] = useState(null)
  const [msg, setMsg] = useState(aviso || '')
  const [erro, setErro] = useState(null)

  async function salvar(corpo) {
    setErro(null)
    setMsg('')
    try {
      await api.patch('/auth/eu/', corpo)
      await carregarUsuario()
      setFoto(null)
      setMsg('Perfil atualizado')
    } catch (err) {
      setErro(err)
    }
  }

  function enviar(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('nome', nome)
    if (foto) fd.append('foto', foto)
    salvar(fd)
  }

  function removerFoto() {
    const fd = new FormData()
    fd.append('foto', '')
    salvar(fd)
  }

  return (
    <section className="cartao estreito">
      <h1>Meu perfil</h1>
      {usuario.foto && <img className="avatar" src={usuario.foto} alt="Sua foto" />}
      <p className="suave">{usuario.email} · Clínica Veterinária</p>
      <form onSubmit={enviar}>
        <Campo label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} erros={erro?.campos?.nome} required />
        <Campo label="Foto" erros={erro?.campos?.foto}>
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
        </Campo>
        {msg && <p className="sucesso" role="status">{msg}</p>}
        {erro && !Object.keys(erro.campos).length && <p className="msg-erro" role="alert">{erro.message}</p>}
        <button>Salvar</button>
      </form>
      <div className="acoes">
        {usuario.foto && <button className="secundario" onClick={removerFoto}>Remover foto</button>}
        <Link className="botao secundario" to="/perfil/senha">Alterar senha</Link>
        <button className="secundario" onClick={() => { sair(); navigate('/bem-vindo') }}>Sair</button>
      </div>
    </section>
  )
}
