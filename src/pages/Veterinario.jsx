import { Card, Chip } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link, useParams } from 'react-router-dom'
import { buscarTodas } from '../api/client'
import { useAuth } from '../AuthContext'
import { Avaliacao } from '../components/Avaliacao'
import { Carregando } from '../components/Carregando'
import { CarregarMais } from '../components/CarregarMais'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'
import { useApi, usePaginado } from '../hooks/useApi'

export function Veterinario() {
  const { id } = useParams()
  const { pode } = useAuth()
  const recurso = useApi(`/recursos/${id}/`)
  const servicos = useApi(`/servicos/?recursos=${id}`, buscarTodas)
  const avaliacoes = usePaginado(`/avaliacoes/?recurso=${id}`)

  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />
  if (servicos.erro) return <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />
  if (recurso.carregando || servicos.carregando) return <Carregando />

  const { nome, bio, foto } = recurso.dados

  return (
    <>
      <Card className="mb-4">
        <Card.Content className="flex gap-4 items-center">
          <Foto src={foto} tamanho={120} />
          <div>
            <h2>{nome}</h2>
            <p className="text-muted">{bio}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {servicos.dados.map(servico => (
                <Chip key={servico.id} color="default" variant="soft">{servico.nome}</Chip>
              ))}
            </div>
            {pode('api.add_agendamento') && (
              <Link to={`/agendar?recurso=${id}`} className={buttonVariants({ variant: 'primary' })}>
                <i className="bi bi-calendar-plus"></i> Agendar com este veterinário
              </Link>
            )}
          </div>
        </Card.Content>
      </Card>

      <h4>Avaliações</h4>
      {avaliacoes.erro && <Erro erro={avaliacoes.erro} tentarDeNovo={avaliacoes.recarregar} />}
      {!avaliacoes.carregando && !avaliacoes.erro && avaliacoes.itens.length === 0 && (
        <p className="text-muted">Ainda sem avaliações.</p>
      )}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {avaliacoes.itens.map(avaliacao => (
          <Avaliacao key={avaliacao.id} avaliacao={avaliacao} />
        ))}
      </div>
      {avaliacoes.carregando ? <Carregando /> : <CarregarMais lista={avaliacoes} />}
    </>
  )
}
