import { useState } from 'react'
import { Alert, Button, Card, Checkbox, FieldError, Form, Input, Label, Switch, TextArea, TextField } from '@heroui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, buscarTodas, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

const NOVO = { nome: '', descricao: '', duracao_min: 30, preco: '0.00', imagem: null, recursos: [], ativo: true }

export function NovoServico() {
  const recursos = useApi('/recursos/', buscarTodas)

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />
  if (recursos.carregando) return <Carregando />

  return <FormServico servico={NOVO} recursos={recursos.dados} />
}

export function EditarServico() {
  const { id } = useParams()
  const servico = useApi(`/servicos/${id}/`)
  const recursos = useApi('/recursos/', buscarTodas)

  if (servico.erro) return <Erro erro={servico.erro} tentarDeNovo={servico.recarregar} />
  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />
  if (servico.carregando || recursos.carregando) return <Carregando />

  return <FormServico servico={servico.dados} recursos={recursos.dados} />
}

function FormServico({ servico, recursos }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(servico.nome)
  const [descricao, setDescricao] = useState(servico.descricao)
  const [duracao, setDuracao] = useState(servico.duracao_min)
  const [preco, setPreco] = useState(servico.preco)
  const [escolhidos, setEscolhidos] = useState(servico.recursos)
  const [ativo, setAtivo] = useState(servico.ativo)
  const [imagem, setImagem] = useState(servico.imagem)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})

  function marcar(id, marcado) {
    if (marcado) {
      setEscolhidos([...escolhidos, id])
    } else {
      setEscolhidos(escolhidos.filter(r => r !== id))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})
    const corpo = { nome, descricao, duracao_min: duracao, preco, recursos: escolhidos, ativo }

    try {
      const salvo = servico.id
        ? await api(`/servicos/${servico.id}/`, { method: 'PATCH', body: corpo })
        : await api('/servicos/', { method: 'POST', body: corpo })

      // a lista de recursos vai em JSON; a imagem vai depois, em multipart
      if (arquivo) {
        const formulario = new FormData()
        formulario.append('imagem', arquivo)
        await api(`/servicos/${salvo.id}/`, { method: 'PATCH', body: formulario })
      }
      navigate('/admin/servicos')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
    }
  }

  async function removerImagem() {
    try {
      await api(`/servicos/${servico.id}/`, { method: 'PATCH', body: { imagem: null } })
      setImagem(null)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  return (
    <Card>
      <Card.Content>
        <h2 className="mb-4">{servico.id ? 'Editar serviço' : 'Novo serviço'}</h2>
        {erro && <Alert status="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit} className="space-y-4">
          <TextField name="nome" value={nome} onChange={setNome} isRequired isInvalid={!!erros.nome}>
            <Label>Nome</Label>
            <Input />
            <FieldError>{erros.nome?.join(' ')}</FieldError>
          </TextField>
          <TextField name="descricao" value={descricao} onChange={setDescricao} isInvalid={!!erros.descricao}>
            <Label>Descrição</Label>
            <TextArea rows={2} />
            <FieldError>{erros.descricao?.join(' ')}</FieldError>
          </TextField>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="duracao" value={String(duracao)} onChange={valor => setDuracao(Number(valor))} isInvalid={!!erros.duracao_min}>
              <Label>Duração (min)</Label>
              <Input type="number" />
              <FieldError>{erros.duracao_min?.join(' ')}</FieldError>
            </TextField>
            <TextField name="preco" value={preco} onChange={valor => setPreco(Number(valor))} isInvalid={!!erros.preco}>
              <Label>Preço (R$)</Label>
              <Input type="number" step="0.01" />
              <FieldError>{erros.preco?.join(' ')}</FieldError>
            </TextField>
          </div>
          <div className="mb-3">
            <Label>Veterinários que oferecem</Label>
            {recursos.map(recurso => (
              <Checkbox
                key={recurso.id}
                isSelected={escolhidos.includes(recurso.id)}
                onChange={marcado => marcar(recurso.id, marcado)}
                isInvalid={!!erros.recursos}
              >
                <Checkbox.Content>
                  <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                  {recurso.ativo ? recurso.nome : `${recurso.nome} (inativo)`}
                </Checkbox.Content>
              </Checkbox>
            ))}
            {erros.recursos && <div className="text-sm text-red-600">{erros.recursos.join(' ')}</div>}
          </div>
          <TextField name="imagem" isInvalid={!!erros.imagem}>
            <Label>Imagem</Label>
            {imagem && (
              <div className="mb-2 flex items-center gap-3">
                <img src={imagem} width={160} className="rounded border border-separator p-1" />
                <Button variant="ghost" size="sm" onPress={removerImagem}>Remover imagem</Button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => setArquivo(e.target.files[0])} className="block w-full text-sm text-muted" />
            <FieldError>{erros.imagem?.join(' ')}</FieldError>
          </TextField>
          <Switch isSelected={ativo} onChange={setAtivo} className="mb-3">
            <Switch.Content>
              <Switch.Control><Switch.Thumb /></Switch.Control>
              Ativo (inativos não aparecem para os tutores)
            </Switch.Content>
          </Switch>
          <div className="flex gap-2">
            <Button variant="ghost" onPress={() => navigate('/admin/servicos')}>Voltar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  )
}
