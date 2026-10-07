import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

const MENU_TUTOR = [
  ['/', 'Início'],
  ['/agendar', 'Agendar'],
  ['/consultas', 'Minhas consultas'],
  ['/veterinarios', 'Veterinários'],
  ['/perfil', 'Perfil'],
]
const MENU_ADMIN = [
  ['/admin', 'Agenda'],
  ['/admin/confirmar', 'A confirmar'],
  ['/admin/negocio', 'Negócio'],
  ['/admin/veterinarios', 'Veterinários'],
  ['/admin/servicos', 'Serviços'],
  ['/admin/avaliacoes', 'Avaliações'],
  ['/perfil', 'Perfil'],
]

export default function Layout() {
  const { ehAdmin, pode } = useAuth()
  const menu = (ehAdmin ? MENU_ADMIN : MENU_TUTOR).filter(
    ([to]) => to !== '/agendar' || pode('api.add_agendamento'),
  )
  return (
    <>
      <header className="topo">
        <strong>Clínica Veterinária</strong>
        <nav>
          {menu.map(([to, nome]) => (
            <NavLink key={to} to={to} end>{nome}</NavLink>
          ))}
        </nav>
      </header>
      <main className="conteudo"><Outlet /></main>
    </>
  )
}