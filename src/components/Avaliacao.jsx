import { formatarData } from '../formatos'
import { Estrelas } from './Estrelas'

export function Avaliacao({ avaliacao }) {
  return (
    <div className="p-3">
      <div className="flex justify-between">
        <Estrelas nota={avaliacao.nota} />
        <small className="text-muted">{formatarData(avaliacao.inicio)}</small>
      </div>
      {avaliacao.comentario && <p className="my-1">{avaliacao.comentario}</p>}
      <small className="text-muted">
        {avaliacao.cliente_nome} · {avaliacao.servico_nome} · {avaliacao.recurso_nome}
      </small>
    </div>
  )
}
