import { useState } from 'react'
import { Alert, Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Link, useLocation } from 'react-router-dom'
import { buttonVariants } from '@heroui/styles'
import { api, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'
import { Foto } from '../components/Foto'

export function Perfil() {
  const { usuario, setUsuario, sair } = useAuth()
  const location = useLocation()
  const [nome, setNome] = useState(usuario.nome)
  const [foto, setFoto] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [salvo, setSalvo] = useState(false)

  async function salvar(corpo) {
    setErro(null)
    setErros({})
    setSalvo(false)
    try {
      setUsuario(await api('/auth/eu/', { method: 'PATCH', body: corpo }))
      setSalvo(true)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    if (foto) {
      formulario.append('foto', foto)
    }
    salvar(formulario)
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <Card>
          <Card.Content>
            <div className="text-center mb-4">
              <Foto src={usuario.foto} tamanho={96} />
              <h2 className="mt-2 mb-0">{usuario.nome}</h2>
              <div className="text-muted">{usuario.email}</div>
              <div className="text-muted">{usuario.organizacao.nome}</div>
            </div>

            {erro && <Alert status="danger">{erro}</Alert>}
            {salvo && <Alert status="success">Perfil atualizado.</Alert>}
            {location.state?.mensagem && <Alert status="success">{location.state.mensagem}</Alert>}

            <Form onSubmit={handleSubmit} className="space-y-4">
              <TextField name="nome" value={nome} onChange={setNome} isRequired isInvalid={!!erros.nome}>
                <Label>Nome</Label>
                <Input />
                <FieldError>{erros.nome?.join(' ')}</FieldError>
              </TextField>
              <TextField name="foto" isInvalid={!!erros.foto}>
                <Label>Foto</Label>
                <input type="file" accept="image/*" onChange={e => setFoto(e.target.files[0])} className="block w-full text-sm text-muted" />
                <FieldError>{erros.foto?.join(' ')}</FieldError>
              </TextField>
              <div className="flex gap-2">
                <Button type="submit" variant="primary">Salvar</Button>
                {usuario.foto && (
                  <Button variant="ghost" onPress={() => salvar({ foto: null })}>
                    Remover foto
                  </Button>
                )}
                <Link to="/perfil/senha" className={buttonVariants({ variant: 'outline', className: 'ms-auto' })}>
                  <i className="bi bi-key"></i> Alterar senha
                </Link>
                <Button variant="danger-soft" onPress={sair}>
                  <i className="bi bi-box-arrow-right"></i> Sair
                </Button>
              </div>
            </Form>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
