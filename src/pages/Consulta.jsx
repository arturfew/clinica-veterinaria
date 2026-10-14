import { useState } from 'react'
import { Alert, Button, Card } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
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
      <Card.Header className="flex justify-between items-center">
        <h4 className="mb-0">{consulta.servico_nome}</h4>
        <StatusConsulta status={consulta.status} />
      </Card.Header>
      <div className="divide-y divide-separator">
        <div className="p-3"><strong>Veterinário:</strong> {consulta.recurso_nome}</div>
        {pode('api.view_agendamento') && (
          <div className="p-3"><strong>Tutor:</strong> {consulta.cliente_nome}</div>
        )}
        <div className="p-3"><strong>Dia:</strong> {formatarData(consulta.inicio)}</div>
        <div className="p-3">
          <strong>Horário:</strong> {formatarHora(consulta.inicio)} às {formatarHora(consulta.fim)} ({duracao} min)
        </div>
        {consulta.observacoes && (
          <div className="p-3"><strong>Observações:</strong> {consulta.observacoes}</div>
        )}
        {consulta.nota && (
          <div className="p-3">
            <strong>Avaliação:</strong> <Estrelas nota={consulta.nota} />
            {consulta.comentario && <p className="mb-0 mt-1">{consulta.comentario}</p>}
          </div>
        )}
      </div>
      <Card.Content>
        {erroAcao && <Alert status="danger">{erroAcao}</Alert>}
        <div className="flex gap-2">
          <Button variant="ghost" onPress={() => navigate(-1)}>Voltar</Button>
          {pode('api.avaliar_agendamento') && consulta.status === 'concluido' && !consulta.nota && (
            <Link to={`/consultas/${id}/avaliar`} className={buttonVariants({ variant: 'primary' })}>
              <i className="bi bi-star"></i> Avaliar
            </Link>
          )}
          {pode('api.confirmar_agendamento') && consulta.status === 'solicitado' && (
            <Button variant="primary" onPress={() => setAcao('confirmar')}>
              <i className="bi bi-check-lg"></i> Confirmar
            </Button>
          )}
          {pode('api.concluir_agendamento') && consulta.status === 'confirmado' && (
            <Button variant="primary" onPress={() => setAcao('concluir')}>
              <i className="bi bi-check2-all"></i> Concluir
            </Button>
          )}
          {pode('api.cancelar_agendamento') && ativa && (
            <Button variant="danger-soft" className="ms-auto" onPress={() => setAcao('cancelar')}>
              Cancelar
            </Button>
          )}
        </div>
      </Card.Content>
      <ConfirmarAcao acao={acao} onConfirmar={confirmarAcao} onFechar={() => setAcao(null)} />
    </Card>
  )
}
