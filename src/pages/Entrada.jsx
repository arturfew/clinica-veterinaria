import { Link } from 'react-router-dom'
import { buttonVariants } from '@heroui/styles'

export function Entrada() {
  return (
    <div className="text-center">
      <img src="/logo.svg" alt="Clínica Veterinária" className="mb-4 w-full" />
      <div className="mt-4 grid gap-2">
        <Link to="/login" className={buttonVariants({ fullWidth: true })}>
          Entrar
        </Link>
        <Link
          to="/cadastro"
          className={buttonVariants({ fullWidth: true, variant: 'secondary' })}
        >
          Criar conta
        </Link>
      </div>
    </div>
  )
}