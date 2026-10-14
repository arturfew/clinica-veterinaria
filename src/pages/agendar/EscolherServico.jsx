import { Alert, Card } from '@heroui/react'
import { Link, useSearchParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { formatarPreco } from '../../formatos'
import { usePaginado } from '../../hooks/useApi'

export function EscolherServico() {
  const [params] = useSearchParams()
  const recurso = params.get('recurso')
  const servicos = usePaginado(recurso ? `/servicos/?recursos=${recurso}` : '/servicos/')

  if (servicos.erro) return <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />

  function proximoPasso(servico) {
    if (recurso) {
      return `/agendar/horario?servico=${servico.id}&recurso=${recurso}`
    }
    return `/agendar/veterinario?servico=${servico.id}`
  }

  return (
    <>
      <small className="text-muted">Passo 1 de 4</small>
      <h2 className="mb-4">Qual serviço?</h2>
      {!servicos.carregando && servicos.itens.length === 0 && <Alert status="accent">Nenhum serviço disponível.</Alert>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servicos.itens.map(servico => (
          <div key={servico.id}>
            <Link to={proximoPasso(servico)} className="block text-inherit no-underline">
              <Card className="h-full">
                {servico.imagem ? (
                  <img src={servico.imagem} alt={servico.nome} className="w-full object-cover" />
                ) : (
                  <div className="bg-surface-secondary py-6 text-center">
                    <i className="bi bi-heart-pulse text-4xl text-muted"></i>
                  </div>
                )}
                <Card.Content>
                  <Card.Title>{servico.nome}</Card.Title>
                  <Card.Description className="text-muted">{servico.descricao}</Card.Description>
                </Card.Content>
                <Card.Footer className="flex justify-between">
                  <span><i className="bi bi-clock"></i> {servico.duracao_min} min</span>
                  <strong>{formatarPreco(servico.preco)}</strong>
                </Card.Footer>
              </Card>
            </Link>
          </div>
        ))}
      </div>
      {servicos.carregando ? <Carregando /> : <CarregarMais lista={servicos} />}
    </>
  )
}
