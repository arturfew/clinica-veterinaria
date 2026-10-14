import { Chip } from '@heroui/react'

const STATUS = {
  solicitado: { cor: 'warning', texto: 'Solicitada' },
  confirmado: { cor: 'accent', texto: 'Confirmada' },
  concluido: { cor: 'success', texto: 'Concluída' },
  cancelado: { cor: 'default', texto: 'Cancelada' },
}

export function StatusConsulta({ status }) {
  const { cor, texto } = STATUS[status] || { cor: 'default', texto: status }
  return (
    <Chip color={cor} variant="soft">
      {texto}
    </Chip>
  )
}
