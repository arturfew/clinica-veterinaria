import { Button } from '@heroui/react'

export function CarregarMais({ lista }) {
  if (!lista.temMais) return null
  return (
    <div className="text-center my-3">
      <Button variant="outline" onPress={lista.carregarMais} isDisabled={lista.carregando}>
        Carregar mais
      </Button>
    </div>
  )
}
