import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, tokens, ORGANIZACAO, definirAoExpirar } from '../services/api.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(!!tokens.get())

  const sair = useCallback(() => {
    tokens.clear()
    setUsuario(null)
  }, [])

  const carregarUsuario = useCallback(async () => {
    const eu = await api.get('/auth/eu/')
    setUsuario(eu)
    return eu
  }, [])

  useEffect(() => {
    definirAoExpirar(() => setUsuario(null))
    if (tokens.get()) {
      carregarUsuario().catch(sair).finally(() => setCarregando(false))
    }
  }, [carregarUsuario, sair])

  async function entrar(email, senha) {
    const t = await api.post(
      '/auth/login/',
      { organizacao: ORGANIZACAO, email, senha },
      { auth: false },
    )
    tokens.set({ access: t.access, refresh: t.refresh })
    return carregarUsuario()
  }

  // A interface decide pelo que o usuário PODE, não pelo nome do grupo.
  const pode = (permissao) => !!usuario?.permissoes?.includes(permissao)
  const ehAdmin = pode('api.change_organizacao')

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, entrar, sair, carregarUsuario, pode, ehAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}