import { Button, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function Entrada() {
  return (
    <div className="text-center">
      <Image src="/logo.svg" alt="Clínica Veterinária" fluid className="mb-4" />
      <div className="d-grid gap-2 mt-4">
        <Button as={Link} to="/login">Entrar</Button>
        <Button as={Link} to="/cadastro" variant="outline-primary">Criar conta</Button>
      </div>
    </div>
  )
}
