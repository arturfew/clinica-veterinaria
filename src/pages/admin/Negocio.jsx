import { useState } from 'react'
import { Alert, Button, Card, FieldError, Form, Input, Label, TextArea, TextField } from '@heroui/react'
import { api, mensagemDeErro } from '../../api/client'
import { useAuth } from '../../AuthContext'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

export function Negocio() {
  const { dados, erro, carregando, recarregar } = useApi('/organizacao/')

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  return <FormNegocio organizacao={dados} />
}

function FormNegocio({ organizacao }) {
  const { usuario, setUsuario } = useAuth()
  const [nome, setNome] = useState(organizacao.nome)
  const [descricao, setDescricao] = useState(organizacao.descricao)
  const [logo, setLogo] = useState(organizacao.logo)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [salvo, setSalvo] = useState(false)

  async function salvar(corpo) {
    setErro(null)
    setErros({})
    setSalvo(false)
    try {
      const nova = await api('/organizacao/', { method: 'PATCH', body: corpo })
      setLogo(nova.logo)
      setUsuario({ ...usuario, organizacao: nova })
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
    formulario.append('descricao', descricao)
    if (arquivo) {
      formulario.append('logo', arquivo)
    }
    salvar(formulario)
  }

  return (
    <Card>
      <Card.Content>
        <h2 className="mb-4">Dados do negócio</h2>
        {erro && <Alert status="danger">{erro}</Alert>}
        {salvo && <Alert status="success">Dados salvos.</Alert>}
        <Form onSubmit={handleSubmit} className="space-y-4">
          <TextField name="nome" value={nome} onChange={setNome} isRequired isInvalid={!!erros.nome}>
            <Label>Nome</Label>
            <Input />
            <FieldError>{erros.nome?.join(' ')}</FieldError>
          </TextField>
          <TextField name="descricao" value={descricao} onChange={setDescricao} isInvalid={!!erros.descricao}>
            <Label>Descrição</Label>
            <TextArea rows={3} />
            <FieldError>{erros.descricao?.join(' ')}</FieldError>
          </TextField>
          <TextField name="logo" isInvalid={!!erros.logo}>
            <Label>Logo</Label>
            {logo && (
              <div className="mb-2">
                <img src={logo} width={200} className="rounded border border-separator p-1" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => setArquivo(e.target.files[0])} className="block w-full text-sm text-muted" />
            <FieldError>{erros.logo?.join(' ')}</FieldError>
          </TextField>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">Salvar</Button>
            {logo && (
              <Button variant="ghost" onPress={() => salvar({ logo: null })}>
                Remover logo
              </Button>
            )}
          </div>
        </Form>
      </Card.Content>
    </Card>
  )
}
