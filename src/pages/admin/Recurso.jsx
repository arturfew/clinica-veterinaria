import { useState } from 'react'
import { Alert, Button, Card, Description, FieldError, Form, Input, Label, Switch, TextArea, TextField } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { useApi } from '../../hooks/useApi'

const NOVO = { nome: '', bio: '', foto: null, capacidade: 1, ativo: true }

export function NovoRecurso() {
  return <FormRecurso recurso={NOVO} />
}

export function EditarRecurso() {
  const { id } = useParams()
  const { dados, erro, carregando, recarregar } = useApi(`/recursos/${id}/`)

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  return <FormRecurso recurso={dados} />
}

function FormRecurso({ recurso }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(recurso.nome)
  const [bio, setBio] = useState(recurso.bio)
  const [capacidade, setCapacidade] = useState(recurso.capacidade)
  const [ativo, setAtivo] = useState(recurso.ativo)
  const [foto, setFoto] = useState(recurso.foto)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})

    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('bio', bio)
    formulario.append('capacidade', capacidade)
    formulario.append('ativo', ativo)
    if (arquivo) {
      formulario.append('foto', arquivo)
    }

    try {
      if (recurso.id) {
        await api(`/recursos/${recurso.id}/`, { method: 'PATCH', body: formulario })
      } else {
        await api('/recursos/', { method: 'POST', body: formulario })
      }
      navigate('/admin/recursos')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
    }
  }

  async function removerFoto() {
    try {
      await api(`/recursos/${recurso.id}/`, { method: 'PATCH', body: { foto: null } })
      setFoto(null)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  return (
    <Card>
      <Card.Content>
        <div className="mb-4 flex items-center">
          <h2 className="me-auto mb-0">{recurso.id ? 'Editar veterinário' : 'Novo veterinário'}</h2>
          {recurso.id && (
            <Link to={`/admin/recursos/${recurso.id}/horarios`} className={buttonVariants({ variant: 'outline' })}>
              <i className="bi bi-clock"></i> Horários
            </Link>
          )}
        </div>
        {erro && <Alert status="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit} className="space-y-4">
          <TextField name="nome" value={nome} onChange={setNome} isRequired isInvalid={!!erros.nome}>
            <Label>Nome</Label>
            <Input />
            <FieldError>{erros.nome?.join(' ')}</FieldError>
          </TextField>
          <TextField name="bio" value={bio} onChange={setBio} isInvalid={!!erros.bio}>
            <Label>Bio</Label>
            <TextArea rows={3} />
            <FieldError>{erros.bio?.join(' ')}</FieldError>
          </TextField>
          <TextField name="capacidade" value={String(capacidade)} onChange={valor => setCapacidade(Number(valor))} isInvalid={!!erros.capacidade}>
            <Label>Capacidade</Label>
            <Input type="number" />
            <Description>Quantas consultas o veterinário atende ao mesmo tempo (1 por padrão).</Description>
            <FieldError>{erros.capacidade?.join(' ')}</FieldError>
          </TextField>
          <TextField name="foto" isInvalid={!!erros.foto}>
            <Label>Foto</Label>
            <div className="mb-2 flex items-center gap-3">
              <Foto src={foto} tamanho={64} />
              {foto && (
                <Button variant="ghost" size="sm" onPress={removerFoto}>Remover foto</Button>
              )}
            </div>
            <input type="file" accept="image/*" onChange={e => setArquivo(e.target.files[0])} className="block w-full text-sm text-muted" />
            <FieldError>{erros.foto?.join(' ')}</FieldError>
          </TextField>
          <Switch isSelected={ativo} onChange={setAtivo} className="mb-3">
            <Switch.Content>
              <Switch.Control><Switch.Thumb /></Switch.Control>
              Ativo (inativos não aparecem para os tutores)
            </Switch.Content>
          </Switch>
          <div className="flex gap-2">
            <Button variant="ghost" onPress={() => navigate('/admin/recursos')}>Voltar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  )
}
