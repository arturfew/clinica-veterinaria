import { Link } from 'react-router-dom'
import { formatarData, formatarHora } from '../formatos'
import { StatusConsulta } from './StatusConsulta'

export function ConsultaItem({ consulta, mostrarTutor = false }) {
  return (
    <Link to={`/consultas/${consulta.id}`} className="flex items-center gap-3 p-3 text-inherit no-underline hover:bg-default/50">
      <div className="text-center">
        <div className="font-bold">{formatarHora(consulta.inicio)}</div>
        <small className="text-muted">{formatarData(consulta.inicio)}</small>
      </div>
      <div className="me-auto">
        <div className="font-semibold">{consulta.servico_nome}</div>
        <small className="text-muted">
          {consulta.recurso_nome}
          {mostrarTutor && ` · ${consulta.cliente_nome}`}
        </small>
        {mostrarTutor && consulta.observacoes && (
          <div><small className="italic">{consulta.observacoes}</small></div>
        )}
      </div>
      <StatusConsulta status={consulta.status} />
    </Link>
  )
}
