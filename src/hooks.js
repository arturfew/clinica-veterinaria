import { useCallback, useEffect, useState } from 'react'

// Executa uma busca e entrega { dados, carregando, erro, recarregar }.
export function useApi(buscar, deps = []) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null })

  const recarregar = useCallback(() => {
    setEstado((e) => ({ ...e, carregando: true, erro: null }))
    buscar()
      .then((dados) => setEstado({ dados, carregando: false, erro: null }))
      .catch((erro) => setEstado({ dados: null, carregando: false, erro }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(recarregar, [recarregar])
  return { ...estado, recarregar }
}