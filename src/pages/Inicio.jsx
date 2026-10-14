import { Card } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../AuthContext'
import { Carregando } from '../components/Carregando'
import { ConsultaItem } from '../components/ConsultaItem'
import { Erro } from '../components/Erro'
import { hoje } from '../formatos'
import { useApi } from '../hooks/useApi'

function ehProxima(consulta) {
  return ['solicitado', 'confirmado'].includes(consulta.status) && new Date(consulta.fim) > new Date()
}

// percorre as páginas até achar a primeira consulta que ainda não passou
async function buscarProximaConsulta(caminho) {
  let proxima = caminho
  while (proxima) {
    const dados = await api(proxima)
    const consulta = dados.results.find(ehProxima)
    if (consulta) return consulta
    proxima = dados.next
  }
  return null
}

export function Inicio() {
  const { usuario } = useAuth()
  const organizacao = useApi('/organizacao/')
  const consulta = useApi(`/agendamentos/?data_inicio=${hoje()}`, buscarProximaConsulta)

  if (organizacao.erro) return <Erro erro={organizacao.erro} tentarDeNovo={organizacao.recarregar} />
  if (consulta.erro) return <Erro erro={consulta.erro} tentarDeNovo={consulta.recarregar} />
  if (organizacao.carregando || consulta.carregando) return <Carregando />

  const { nome, descricao, logo } = organizacao.dados

  return (
    <div className="grid gap-4 md:grid-cols-12">
      <div className="md:col-span-5">
        <Card className="text-center h-full">
          <Card.Content>
            <img src={logo ?? '/logo.svg'} alt={nome} className="mb-3 w-full" />
            <Card.Description className="text-muted">{descricao}</Card.Description>
          </Card.Content>
        </Card>
      </div>
      <div className="md:col-span-7">
        <h2>Olá, {usuario.nome}!</h2>
        <h5 className="mt-4">Sua próxima consulta</h5>
        {consulta.dados ? (
          <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm mb-3">
            <ConsultaItem consulta={consulta.dados} />
          </div>
        ) : (
          <p className="text-muted">Você não tem consultas agendadas.</p>
        )}
        <Link to="/agendar" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
          <i className="bi bi-calendar-plus"></i> Agendar
        </Link>
      </div>
    </div>
  )
}
