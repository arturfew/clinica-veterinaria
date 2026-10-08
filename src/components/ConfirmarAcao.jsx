import { Confirmacao } from './Confirmacao'

const ACOES = {
  confirmar: { titulo: 'Confirmar consulta', mensagem: 'Deseja confirmar esta consulta?', variante: 'success' },
  concluir: { titulo: 'Concluir consulta', mensagem: 'Deseja marcar esta consulta como concluída?', variante: 'success' },
  cancelar: { titulo: 'Cancelar consulta', mensagem: 'Deseja mesmo cancelar esta consulta?', variante: 'danger' },
}

export function ConfirmarAcao({ acao, onConfirmar, onFechar }) {
  const { titulo, mensagem, variante } = ACOES[acao] ?? ACOES.confirmar

  return (
    <Confirmacao
      show={acao !== null}
      titulo={titulo}
      mensagem={mensagem}
      textoConfirmar={titulo}
      variante={variante}
      onConfirmar={onConfirmar}
      onFechar={onFechar}
    />
  )
}
