import { Alert, Card } from '@heroui/react'
import { Link } from 'react-router-dom'
import { Carregando } from '../components/Carregando'
import { CarregarMais } from '../components/CarregarMais'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'
import { usePaginado } from '../hooks/useApi'

export function Veterinarios() {
  const recursos = usePaginado('/recursos/')

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />

  return (
    <>
      <h2 className="mb-4">Veterinários</h2>
      {!recursos.carregando && recursos.itens.length === 0 && <Alert status="accent">Nenhum veterinário cadastrado.</Alert>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recursos.itens.map(recurso => (
          <div key={recurso.id}>
            <Link to={`/veterinarios/${recurso.id}`} className="block text-inherit no-underline">
              <Card className="h-full">
                <Card.Content className="flex gap-3">
                  <Foto src={recurso.foto} tamanho={64} />
                  <div>
                    <Card.Title>{recurso.nome}</Card.Title>
                    <Card.Description className="text-muted">{recurso.bio}</Card.Description>
                  </div>
                </Card.Content>
              </Card>
            </Link>
          </div>
        ))}
      </div>
      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}
