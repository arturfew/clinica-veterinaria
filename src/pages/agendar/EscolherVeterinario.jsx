import { Alert, Card } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link, useSearchParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { usePaginado } from '../../hooks/useApi'

export function EscolherVeterinario() {
  const [params] = useSearchParams()
  const servico = params.get('servico')
  const recursos = usePaginado(`/recursos/?servicos=${servico}`)

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />
  if (recursos.carregando && recursos.itens.length === 0) return <Carregando />

  return (
    <>
      <small className="text-muted">Passo 2 de 4</small>
      <h2 className="mb-4">Com quem?</h2>
      {recursos.itens.length === 0 ? (
        <Alert status="accent">Nenhum veterinário realiza este serviço.</Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Card className="h-full">
              <Card.Content className="flex gap-3">
                <i className="bi bi-people-fill text-muted text-3xl"></i>
                <div>
                  <Card.Title>Qualquer um</Card.Title>
                  <Card.Description className="text-muted">Mostra os horários livres de todos.</Card.Description>
                  <Link to={`/agendar/horario?servico=${servico}`} className={buttonVariants({ variant: 'primary' })}>Escolher</Link>
                </div>
              </Card.Content>
            </Card>
          </div>
          {recursos.itens.map(recurso => (
            <div key={recurso.id}>
              <Card className="h-full">
                <Card.Content className="flex gap-3">
                  <Foto src={recurso.foto} tamanho={64} />
                  <div>
                    <Card.Title>{recurso.nome}</Card.Title>
                    <Card.Description className="text-muted">{recurso.bio}</Card.Description>
                    <Link to={`/agendar/horario?servico=${servico}&recurso=${recurso.id}`} className={buttonVariants({ variant: 'primary' })}>
                      Escolher
                    </Link>
                    <Link to={`/veterinarios/${recurso.id}`} className={buttonVariants({ variant: 'ghost' })}>
                      Ver avaliações
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            </div>
          ))}
        </div>
      )}
      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}
