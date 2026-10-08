import { useState } from 'react'
import { Alert, Button, Card, ListGroup } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'
import { Carregando } from '../components/Carregando'
import { ConfirmarAcao } from '../components/ConfirmarAcao'
import { Erro } from '../components/Erro'
import { Estrelas } from '../components/Estrelas'
import { StatusConsulta } from '../components/StatusConsulta'
import { formatarData, formatarHora } from '../formatos'
import { useApi } from '../hooks/useApi'

export function Consulta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pode } = useAuth()
  const { dados: consulta, erro, carregando, recarregar } = useApi(`/agendamentos/${id}/`)
  const [erroAcao, setErroAcao] = useState(null)
  const [acao, setAcao] = useState(null)

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  const ativa = ['solicitado', 'confirmado'].includes(consulta.status)
  const duracao = (new Date(consulta.fim) - new Date(consulta.inicio)) / 60000

  async function executar(acao) {
    setErroAcao(null)
    try {
      await api(`/agendamentos/${id}/${acao}/`, { method: 'POST' })
      recarregar()
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro))
    }
  }

  function confirmarAcao() {
    executar(acao)
    setAcao(null)
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{consulta.servico_nome}</h4>
        <StatusConsulta status={consulta.status} />
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item><strong>Veterinário:</strong> {consulta.recurso_nome}</ListGroup.Item>
        {pode('api.view_agendamento') && (
          <ListGroup.Item><strong>Tutor:</strong> {consulta.cliente_nome}</ListGroup.Item>
        )}
        <ListGroup.Item><strong>Dia:</strong> {formatarData(consulta.inicio)}</ListGroup.Item>
        <ListGroup.Item>
          <strong>Horário:</strong> {formatarHora(consulta.inicio)} às {formatarHora(consulta.fim)} ({duracao} min)
        </ListGroup.Item>
        {consulta.observacoes && (
          <ListGroup.Item><strong>Observações:</strong> {consulta.observacoes}</ListGroup.Item>
        )}
        {consulta.nota && (
          <ListGroup.Item>
            <strong>Avaliação:</strong> <Estrelas nota={consulta.nota} />
            {consulta.comentario && <p className="mb-0 mt-1">{consulta.comentario}</p>}
          </ListGroup.Item>
        )}
      </ListGroup>
      <Card.Body>
        {erroAcao && <Alert variant="danger">{erroAcao}</Alert>}
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>Voltar</Button>
          {pode('api.avaliar_agendamento') && consulta.status === 'concluido' && !consulta.nota && (
            <Button as={Link} to={`/consultas/${id}/avaliar`}>
              <i className="bi bi-star"></i> Avaliar
            </Button>
          )}
          {pode('api.confirmar_agendamento') && consulta.status === 'solicitado' && (
            <Button variant="success" onClick={() => setAcao('confirmar')}>
              <i className="bi bi-check-lg"></i> Confirmar
            </Button>
          )}
          {pode('api.concluir_agendamento') && consulta.status === 'confirmado' && (
            <Button variant="success" onClick={() => setAcao('concluir')}>
              <i className="bi bi-check2-all"></i> Concluir
            </Button>
          )}
          {pode('api.cancelar_agendamento') && ativa && (
            <Button variant="outline-danger" className="ms-auto" onClick={() => setAcao('cancelar')}>
              Cancelar
            </Button>
          )}
        </div>
      </Card.Body>
      <ConfirmarAcao acao={acao} onConfirmar={confirmarAcao} onFechar={() => setAcao(null)} />
    </Card>
  )
}
