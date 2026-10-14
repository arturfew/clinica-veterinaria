import { useState } from 'react'
import { Alert, Button } from '@heroui/react'
import { Link } from 'react-router-dom'
import { api, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { ConfirmarAcao } from '../../components/ConfirmarAcao'
import { Erro } from '../../components/Erro'
import { formatarData, formatarHora } from '../../formatos'
import { usePaginado } from '../../hooks/useApi'

export function AConfirmar() {
  const pedidos = usePaginado('/agendamentos/?status=solicitado')
  const [pendente, setPendente] = useState(null)
  const [erroAcao, setErroAcao] = useState(null)

  async function executar(id, acao) {
    setErroAcao(null)
    try {
      await api(`/agendamentos/${id}/${acao}/`, { method: 'POST' })
      pedidos.recarregar()
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro))
    }
  }

  function confirmarAcao() {
    executar(pendente.id, pendente.acao)
    setPendente(null)
  }

  if (pedidos.erro) return <Erro erro={pedidos.erro} tentarDeNovo={pedidos.recarregar} />

  return (
    <>
      <h2 className="mb-4">A confirmar</h2>
      {erroAcao && <Alert status="danger">{erroAcao}</Alert>}
      {!pedidos.carregando && pedidos.itens.length === 0 && (
        <Alert status="success">Nenhum pedido para confirmar.</Alert>
      )}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {pedidos.itens.map(consulta => (
          <div key={consulta.id} className="flex flex-wrap items-center gap-3 p-3">
            <div className="text-center">
              <div className="font-bold">{formatarHora(consulta.inicio)}</div>
              <small className="text-muted">{formatarData(consulta.inicio)}</small>
            </div>
            <div className="me-auto">
              <Link to={`/consultas/${consulta.id}`} className="font-semibold">{consulta.servico_nome}</Link>
              <div><small className="text-muted">{consulta.recurso_nome} · {consulta.cliente_nome}</small></div>
              {consulta.observacoes && <small className="italic">{consulta.observacoes}</small>}
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onPress={() => setPendente({ id: consulta.id, acao: 'confirmar' })}>
                <i className="bi bi-check-lg"></i> Confirmar
              </Button>
              <Button variant="danger-soft" size="sm" onPress={() => setPendente({ id: consulta.id, acao: 'cancelar' })}>
                Cancelar
              </Button>
            </div>
          </div>
        ))}
      </div>
      {pedidos.carregando ? <Carregando /> : <CarregarMais lista={pedidos} />}

      <ConfirmarAcao
        acao={pendente?.acao ?? null}
        onConfirmar={confirmarAcao}
        onFechar={() => setPendente(null)}
      />
    </>
  )
}
