import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Login from './pages/Login.jsx'
import EmBreve from './pages/EmBreve.jsx'
import Entrada from './pages/Entrada.jsx'
import Cadastro from './pages/Cadastro.jsx'
import EsqueciSenha from './pages/EsqueciSenha.jsx'
import Perfil from './pages/Perfil.jsx'
import AlterarSenha from './pages/AlterarSenha.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/bem-vindo" element={<Entrada />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />

      <Route element={<Layout />}>
        {/* Qualquer usuário logado */}
        <Route element={<RotaProtegida />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/senha" element={<AlterarSenha />} />
        </Route>

        {/* Tutor */}
        <Route element={<RotaProtegida apenasAdmin={false} />}>
          <Route path="/" element={<EmBreve nome="Início (C1)" />} />
          <Route path="/agendar" element={<EmBreve nome="Escolher serviço (C2)" />} />
          <Route path="/consultas" element={<EmBreve nome="Minhas consultas (C7)" />} />
          <Route path="/veterinarios" element={<EmBreve nome="Veterinários (C10)" />} />
        </Route>

        {/* Administrador */}
        <Route element={<RotaProtegida apenasAdmin />}>
          <Route path="/admin" element={<EmBreve nome="Agenda do dia (A1)" />} />
          <Route path="/admin/confirmar" element={<EmBreve nome="A confirmar (A2)" />} />
          <Route path="/admin/negocio" element={<EmBreve nome="Dados do negócio (A4)" />} />
          <Route path="/admin/veterinarios" element={<EmBreve nome="Veterinários (A5)" />} />
          <Route path="/admin/servicos" element={<EmBreve nome="Serviços (A8)" />} />
          <Route path="/admin/avaliacoes" element={<EmBreve nome="Avaliações (A10)" />} />
        </Route>
      </Route>
    </Routes>
  )
}