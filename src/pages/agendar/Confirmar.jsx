import { useState } from 'react'
import { Alert, Button, Card, Description, Form, Label, TextArea, TextField } from '@heroui/react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { formatarData, formatarHora, formatarPreco } from '../../formatos'
import { useApi } from '../../hooks/useApi'

export function Confirmar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const inicio = params.get('inicio')
  const servico = useApi(`/servicos/${params.get('servico')}/`)
  const recurso = useApi(`/recursos/${params.get('recurso')}/`)
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (servico.erro) return <Erro erro={servico.erro} tentarDeNovo={servico.recarregar} />
  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />
  if (servico.carregando || recurso.carregando) return <Carregando />

  const fim = new Date(new Date(inicio).getTime() + servico.dados.duracao_min * 60000)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      const agendamento = await api('/agendamentos/', {
        method: 'POST',
        body: { servico: servico.dados.id, recurso: recurso.dados.id, inicio, observacoes },
      })
      navigate('/agendar/enviado', { state: { agendamento } })
    } catch (erro) {
      // a vaga acabou ou já existe outra consulta no horário: volta para a escolha do horário
      if (erro.dados?.inicio) {
        navigate(location.state?.voltar ?? `/agendar/horario?servico=${servico.dados.id}&data=${inicio.slice(0, 10)}`, {
          state: { erro: erro.dados.inicio.join(' ') },
        })
      } else {
        setErro(mensagemDeErro(erro))
        setEnviando(false)
      }
    }
  }

  return (
    <>
      <small className="text-muted">Passo 4 de 4</small>
      <h2 className="mb-4">Confirmar agendamento</h2>
      <Card>
        <div className="divide-y divide-separator">
          <div className="p-3"><strong>Serviço:</strong> {servico.dados.nome}</div>
          <div className="p-3"><strong>Veterinário:</strong> {recurso.dados.nome}</div>
          <div className="p-3"><strong>Dia:</strong> {formatarData(inicio)}</div>
          <div className="p-3">
            <strong>Horário:</strong> {formatarHora(inicio)} às {formatarHora(fim)} ({servico.dados.duracao_min} min)
          </div>
          <div className="p-3"><strong>Preço:</strong> {formatarPreco(servico.dados.preco)}</div>
        </div>
        <Card.Content>
          {erro && <Alert status="danger">{erro}</Alert>}
          <Form onSubmit={handleSubmit}>
            <TextField name="observacoes" value={observacoes} onChange={setObservacoes} className="mb-3">
              <Label>Observações</Label>
              <TextArea rows={3} placeholder="Ex.: Rex, cachorro de 3 anos: está sem comer há dois dias" />
              <Description>Informe o nome, a espécie e a idade do pet.</Description>
            </TextField>
            <div className="flex gap-2">
              <Button variant="ghost" onPress={() => navigate(-1)}>Voltar</Button>
              <Button type="submit" variant="primary" isDisabled={enviando}>Confirmar</Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </>
  )
}
