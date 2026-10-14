import { usePaginado } from '../hooks/useApi'
import { Carregando } from './Carregando'
import { CarregarMais } from './CarregarMais'
import { ConsultaItem } from './ConsultaItem'
import { Erro } from './Erro'

export function ListaConsultas({ caminho, vazio = 'Nenhuma consulta aqui.', mostrarTutor = false }) {
  const consultas = usePaginado(caminho)

  if (consultas.erro) return <Erro erro={consultas.erro} tentarDeNovo={consultas.recarregar} />

  return (
    <>
      {!consultas.carregando && consultas.itens.length === 0 && <p className="text-muted">{vazio}</p>}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {consultas.itens.map(consulta => (
          <ConsultaItem key={consulta.id} consulta={consulta} mostrarTutor={mostrarTutor} />
        ))}
      </div>
      {consultas.carregando ? <Carregando /> : <CarregarMais lista={consultas} />}
    </>
  )
}
