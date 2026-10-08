import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
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
      <Card.Body>
        <h2>Avaliar consulta</h2>
        <p className="text-secondary">
          {consulta.dados.servico_nome} com {consulta.dados.recurso_nome}, {formatarData(consulta.dados.inicio)}
        </p>
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map(n => (
              <Button key={n} variant="link" className="p-1 fs-2 text-warning" onClick={() => setNota(n)}>
                <i className={n <= nota ? 'bi bi-star-fill' : 'bi bi-star'}></i>
              </Button>
            ))}
          </div>
          <Form.Group className="mb-3" controlId="comentario">
            <Form.Label>Comentário</Form.Label>
            <Form.Control as="textarea" rows={3} value={comentario} onChange={e => setComentario(e.target.value)} />
          </Form.Group>
          <Button type="submit" disabled={nota === 0}>Enviar</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
