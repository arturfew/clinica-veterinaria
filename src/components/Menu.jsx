import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Dropdown } from '@heroui/react'
import { useAuth } from '../AuthContext'
import { Foto } from './Foto'
import { Navbar } from './Navbar'

// Sobre a barra azul-marinho: o item ativo fica laranja (cor da marca) e os
// demais têm texto claro com um leve realce ao passar o mouse.
function classeNav({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
    isActive ? 'text-warning' : 'text-white/75 hover:bg-white/10 hover:text-white'
  }`
}

export function Menu() {
  const { usuario, pode, inicio, sair } = useAuth()
  const organizacao = usuario.organizacao
  const navegar = useNavigate()
  const [aberto, setAberto] = useState(false)

  const itensPrincipais = pode('api.change_organizacao')
    ? [
        { para: '/admin/agenda', rotulo: 'Agenda' },
        { para: '/admin/confirmar', rotulo: 'A confirmar' },
        { para: '/admin/avaliacoes', rotulo: 'Avaliações' },
      ]
    : [
        { para: '/inicio', rotulo: 'Início' },
        ...(pode('api.add_agendamento') ? [{ para: '/agendar', rotulo: 'Agendar' }] : []),
        { para: '/consultas', rotulo: 'Minhas consultas' },
        { para: '/veterinarios', rotulo: 'Veterinários' },
      ]

  const itensCadastros = [
    { para: '/admin/negocio', rotulo: 'Dados do negócio' },
    { para: '/admin/recursos', rotulo: 'Veterinários' },
    { para: '/admin/servicos', rotulo: 'Serviços' },
  ]

  const logo = (
    <img src="/favicon.svg" alt="" className="me-2" height={28} width={28} />
  )

  return (
    <Navbar
      menu={
        aberto && (
          <div className="border-t border-white/15 md:hidden">
            <div className="mx-auto w-full max-w-6xl px-4 py-3">
              <ul className="flex flex-col gap-1">
                {itensPrincipais.map((item) => (
                  <li key={item.para}>
                    <NavLink
                      to={item.para}
                      className={classeNav}
                      onClick={() => setAberto(false)}
                    >
                      {item.rotulo}
                    </NavLink>
                  </li>
                ))}
                {pode('api.change_organizacao') &&
                  itensCadastros.map((item) => (
                    <li key={item.para}>
                      <Link
                        to={item.para}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-white/75 no-underline transition-colors hover:bg-white/10 hover:text-white"
                        onClick={() => setAberto(false)}
                      >
                        {item.rotulo}
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="mt-2 flex flex-col gap-1 border-t border-white/15 pt-2">
                <Link
                  to="/perfil"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/75 no-underline transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setAberto(false)}
                >
                  <i className="bi bi-person"></i> Meu perfil
                </Link>
                <button
                  type="button"
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setAberto(false)
                    sair()
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i> Sair
                </button>
              </div>
            </div>
          </div>
        )
      }
    >
      <button
        type="button"
        aria-label="Alternar menu"
        className="rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        onClick={() => setAberto(!aberto)}
      >
        <i className={`bi text-xl ${aberto ? 'bi-x-lg' : 'bi-list'}`} />
      </button>

      <Link to={inicio} className="flex items-center text-lg font-bold text-white no-underline">
        {logo}
        {organizacao.nome}
      </Link>

      <ul className="hidden items-center gap-1 ms-4 md:flex">
        {itensPrincipais.map((item) => (
          <li key={item.para}>
            <NavLink to={item.para} className={classeNav}>
              {item.rotulo}
            </NavLink>
          </li>
        ))}
        {pode('api.change_organizacao') && (
          <li>
            <Dropdown>
              <Dropdown.Trigger className="rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white">
                Cadastros
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  {itensCadastros.map((item) => (
                    <Dropdown.Item
                      key={item.para}
                      id={item.para}
                      onAction={() => navegar(item.para)}
                    >
                      {item.rotulo}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </li>
        )}
      </ul>

      <div className="ms-auto hidden md:block">
        <Dropdown>
          <Dropdown.Trigger className="flex items-center gap-2 rounded-md border border-white/20 px-2 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
            <Foto src={usuario.foto} tamanho={24} cor="text-white/70" />
            {usuario.nome}
            <i className="bi bi-chevron-down text-xs"></i>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom right">
            <Dropdown.Menu>
              <Dropdown.Item id="perfil" onAction={() => navegar('/perfil')}>
                <i className="bi bi-person"></i> Meu perfil
              </Dropdown.Item>
              <Dropdown.Item id="sair" onAction={sair}>
                <i className="bi bi-box-arrow-right"></i> Sair
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </Navbar>
  )
}
