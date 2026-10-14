import { useState } from 'react'
import { Alert, Button, Card, Form, Label, TextArea, TextField } from '@heroui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../api/client'
import { Carregando } from '../components/Carregando'
import { Erro } from '../components/Erro'
import { formatarData } from '../formatos'
import { useApi } from '../hooks/useApi'

export function Avaliar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const consulta = useApi(`/agendamentos/${id}/`)
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [erro, setErro] = useState(null)

  if (consulta.erro) return <Erro erro={consulta.erro} tentarDeNovo={consulta.recarregar} />
  if (consulta.carregando) return <Carregando />

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    try {
      await api(`/agendamentos/${id}/avaliar/`, { method: 'POST', body: { nota, comentario } })
      navigate(`/consultas/${id}`)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  return (
    <Card>
      <Card.Content>
        <h2>Avaliar consulta</h2>
        <p className="text-muted">
          {consulta.dados.servico_nome} com {consulta.dados.recurso_nome}, {formatarData(consulta.dados.inicio)}
        </p>
        {erro && <Alert status="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map(n => (
              <Button key={n} type="button" variant="ghost" className="p-1 text-2xl text-yellow-500" onPress={() => setNota(n)}>
                <i className={n <= nota ? 'bi bi-star-fill' : 'bi bi-star'}></i>
              </Button>
            ))}
          </div>
          <TextField name="comentario" value={comentario} onChange={setComentario} className="mb-3">
            <Label>Comentário</Label>
            <TextArea rows={3} />
          </TextField>
          <Button type="submit" variant="primary" isDisabled={nota === 0}>Enviar</Button>
        </Form>
      </Card.Content>
    </Card>
  )
}
