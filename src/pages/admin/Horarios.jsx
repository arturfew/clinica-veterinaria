import { useState } from 'react'
import { Alert, Button, Card, FieldError, Form, Input, Label, ListBox, Modal, Select, TextField } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link, useParams } from 'react-router-dom'
import { api, buscarTodas, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Confirmacao } from '../../components/Confirmacao'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

const DIAS = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

export function Horarios() {
  const { id } = useParams()
  const recurso = useApi(`/recursos/${id}/`)
  const horarios = useApi(`/disponibilidades/?recurso=${id}`, buscarTodas)
  const [editando, setEditando] = useState(null)
  const [removendo, setRemovendo] = useState(null)
  const [erro, setErro] = useState(null)

  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />
  if (horarios.erro) return <Erro erro={horarios.erro} tentarDeNovo={horarios.recarregar} />
  if (recurso.carregando || horarios.carregando) return <Carregando />

  async function remover() {
    setErro(null)
    try {
      await api(`/disponibilidades/${removendo}/`, { method: 'DELETE' })
      horarios.recarregar()
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
    setRemovendo(null)
  }

  function salvo() {
    setEditando(null)
    horarios.recarregar()
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <div className="me-auto">
          <h2 className="mb-0">Horários</h2>
          <span className="text-muted">{recurso.dados.nome}</span>
        </div>
        <Link to={`/admin/recursos/${id}`} className={buttonVariants({ variant: 'ghost' })}>Voltar</Link>
      </div>
      {erro && <Alert status="danger">{erro}</Alert>}
      {horarios.dados.length === 0 && (
        <Alert status="warning">Sem horários: ninguém consegue agendar.</Alert>
      )}

      {DIAS.map((nome, dia) => (
        <Card key={dia} className="mb-3">
          <Card.Header className="flex items-center">
            <span className="me-auto">{nome}</span>
            <Button size="sm" variant="outline" onPress={() => setEditando({ dia_semana: dia, hora_inicio: '', hora_fim: '' })}>
              <i className="bi bi-plus-lg"></i> Adicionar
            </Button>
          </Card.Header>
          <div className="divide-y divide-separator">
            {horarios.dados
              .filter(h => h.dia_semana === dia)
              .map(h => (
                <div key={h.id} className="flex items-center gap-2 p-3">
                  <span className="me-auto">
                    {h.hora_inicio.slice(0, 5)} às {h.hora_fim.slice(0, 5)}
                  </span>
                  <Button size="sm" variant="ghost" onPress={() => setEditando(h)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button size="sm" variant="danger-soft" onPress={() => setRemovendo(h.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      ))}

      {editando && (
        <FormHorario recurso={id} horario={editando} onSalvo={salvo} onFechar={() => setEditando(null)} />
      )}
      <Confirmacao
        show={removendo !== null}
        titulo="Remover horário"
        mensagem="Deseja mesmo remover esta faixa de horário?"
        textoConfirmar="Remover"
        variante="danger"
        onConfirmar={remover}
        onFechar={() => setRemovendo(null)}
      />
    </>
  )
}

function FormHorario({ recurso, horario, onSalvo, onFechar }) {
  const [dia, setDia] = useState(horario.dia_semana)
  const [inicio, setInicio] = useState(horario.hora_inicio.slice(0, 5))
  const [fim, setFim] = useState(horario.hora_fim.slice(0, 5))
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})
    const corpo = { recurso, dia_semana: dia, hora_inicio: inicio, hora_fim: fim }
    try {
      if (horario.id) {
        await api(`/disponibilidades/${horario.id}/`, { method: 'PATCH', body: corpo })
      } else {
        await api('/disponibilidades/', { method: 'POST', body: corpo })
      }
      onSalvo()
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
    }
  }

  return (
    <Modal isOpen onOpenChange={open => { if (!open) onFechar() }}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Modal.Header>
                <Modal.Heading>{horario.id ? 'Editar horário' : 'Novo horário'}</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                {erro && <Alert status="danger">{erro}</Alert>}
                <Select aria-label="Dia da semana" selectedKey={String(dia)} onSelectionChange={k => setDia(Number(k))}>
                  <Label>Dia da semana</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {DIAS.map((nome, i) => (
                        <ListBox.Item key={i} id={String(i)} textValue={nome}>{nome}</ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <TextField name="inicio" value={inicio} onChange={setInicio} isRequired isInvalid={!!erros.hora_inicio}>
                  <Label>Início</Label>
                  <Input type="time" />
                  <FieldError>{erros.hora_inicio?.join(' ')}</FieldError>
                </TextField>
                <TextField name="fim" value={fim} onChange={setFim} isRequired isInvalid={!!erros.hora_fim}>
                  <Label>Fim</Label>
                  <Input type="time" />
                  <FieldError>{erros.hora_fim?.join(' ')}</FieldError>
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={onFechar}>Voltar</Button>
                <Button type="submit" variant="primary">Salvar</Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
