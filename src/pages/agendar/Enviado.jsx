import { Alert, Button, Card, ListGroup } from 'react-bootstrap'
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
      <Card.Body>
        <i className="bi bi-check-circle-fill text-success display-3"></i>
        <h2 className="my-3">Agendamento enviado!</h2>
        <ListGroup className="mb-3 text-start">
          <ConsultaItem consulta={agendamento} />
        </ListGroup>
        <Alert variant="info">O administrador da clínica vai confirmar a sua consulta.</Alert>
        <div className="d-flex justify-content-center gap-2">
          <Button as={Link} to={`/consultas/${agendamento.id}`}>Ver consulta</Button>
          <Button as={Link} to="/inicio" variant="outline-primary">Início</Button>
        </div>
      </Card.Body>
    </Card>
  )
}
