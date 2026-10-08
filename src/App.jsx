import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'
import { Layout } from './components/Layout'
import { Publica } from './components/Publica'
import { AConfirmar } from './pages/admin/AConfirmar'
import { Agenda } from './pages/admin/Agenda'
import { Avaliacoes } from './pages/admin/Avaliacoes'
import { Horarios } from './pages/admin/Horarios'
import { Negocio } from './pages/admin/Negocio'
import { EditarRecurso, NovoRecurso } from './pages/admin/Recurso'
import { Recursos } from './pages/admin/Recursos'
import { EditarServico, NovoServico } from './pages/admin/Servico'
import { Servicos } from './pages/admin/Servicos'
import { Confirmar } from './pages/agendar/Confirmar'
import { AlterarSenha } from './pages/AlterarSenha'
import { EscolherHorario } from './pages/agendar/EscolherHorario'
import { EscolherVeterinario } from './pages/agendar/EscolherVeterinario'
import { EscolherServico } from './pages/agendar/EscolherServico'
import { Enviado } from './pages/agendar/Enviado'
import { Consulta } from './pages/Consulta'
import { Avaliar } from './pages/Avaliar'
import { Cadastro } from './pages/Cadastro'
import { Entrada } from './pages/Entrada'
import { EsqueciSenha } from './pages/EsqueciSenha'
import { Inicio } from './pages/Inicio'
import { Login } from './pages/Login'
import { MinhasConsultas } from './pages/MinhasConsultas'
import { NaoEncontrado } from './pages/NaoEncontrado'
import { Perfil } from './pages/Perfil'
import { Veterinario } from './pages/Veterinario'
import { Veterinarios } from './pages/Veterinarios'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Publica />}>
            <Route index element={<Entrada />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/agendar" element={<EscolherServico />} />
            <Route path="/agendar/veterinario" element={<EscolherVeterinario />} />
            <Route path="/agendar/horario" element={<EscolherHorario />} />
            <Route path="/agendar/confirmar" element={<Confirmar />} />
            <Route path="/agendar/enviado" element={<Enviado />} />
            <Route path="/consultas" element={<MinhasConsultas />} />
            <Route path="/consultas/:id" element={<Consulta />} />
            <Route path="/consultas/:id/avaliar" element={<Avaliar />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/senha" element={<AlterarSenha />} />
            <Route path="/admin/agenda" element={<Agenda />} />
            <Route path="/admin/confirmar" element={<AConfirmar />} />
            <Route path="/admin/negocio" element={<Negocio />} />
            <Route path="/admin/recursos" element={<Recursos />} />
            <Route path="/admin/recursos/novo" element={<NovoRecurso />} />
            <Route path="/admin/recursos/:id" element={<EditarRecurso />} />
            <Route path="/admin/recursos/:id/horarios" element={<Horarios />} />
            <Route path="/admin/servicos" element={<Servicos />} />
            <Route path="/admin/servicos/novo" element={<NovoServico />} />
            <Route path="/admin/servicos/:id" element={<EditarServico />} />
            <Route path="/admin/avaliacoes" element={<Avaliacoes />} />
            <Route path="/veterinarios" element={<Veterinarios />} />
            <Route path="/veterinarios/:id" element={<Veterinario />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
