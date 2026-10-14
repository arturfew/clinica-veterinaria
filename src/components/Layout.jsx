import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'
import { Menu } from './Menu'

export function Layout() {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return <Carregando />
  }
  if (!usuario) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Menu />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-separator py-6 text-center text-sm text-muted">
        {usuario.organizacao.nome} · agendamentos online
      </footer>
    </div>
  )
}
