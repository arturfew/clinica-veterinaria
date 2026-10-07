import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Carregando } from './Estado.jsx'

// apenasAdmin: true  -> só quem tem permissão de administrador
// apenasAdmin: false -> só tutor (área de agendamento)
export default function RotaProtegida({ apenasAdmin }) {
  const { usuario, carregando, ehAdmin } = useAuth()
  if (carregando) return <Carregando />
  if (!usuario) return <Navigate to="/bem-vindo" replace />
  if (apenasAdmin === true && !ehAdmin) return <Navigate to="/" replace />
  if (apenasAdmin === false && ehAdmin) return <Navigate to="/admin" replace />
  return <Outlet />
}