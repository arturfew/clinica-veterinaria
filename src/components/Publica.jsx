import { Card } from '@heroui/react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'

export function Publica() {
  const { usuario, carregando, inicio } = useAuth()

  if (carregando) {
    return <Carregando />
  }
  if (usuario) {
    return <Navigate to={inicio} />
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-5">
      <Card className="shadow-sm">
        <Card.Content className="p-4">
          <Outlet />
        </Card.Content>
      </Card>
    </div>
  )
}
