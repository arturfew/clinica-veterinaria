import { Alert, Card } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ConsultaItem } from '../../components/ConsultaItem'

export function Enviado() {
  const location = useLocation()
  const agendamento = location.state?.agendamento

  if (!agendamento) {
    return <Navigate to="/consultas" />
  }

  return (
    <Card className="text-center">
      <Card.Content>
        <i className="bi bi-check-circle-fill text-green-600 text-5xl"></i>
        <h2 className="my-3">Agendamento enviado!</h2>
        <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm mb-3 text-left">
          <ConsultaItem consulta={agendamento} />
        </div>
        <Alert status="accent">O administrador da clínica vai confirmar a sua consulta.</Alert>
        <div className="flex justify-center gap-2">
          <Link to={`/consultas/${agendamento.id}`} className={buttonVariants({ variant: 'primary' })}>Ver consulta</Link>
          <Link to="/inicio" className={buttonVariants({ variant: 'outline' })}>Início</Link>
        </div>
      </Card.Content>
    </Card>
  )
}
