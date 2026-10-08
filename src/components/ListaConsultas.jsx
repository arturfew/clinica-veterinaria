import { ListGroup } from 'react-bootstrap'
import { usePaginado } from '../hooks/useApi'
import { ConsultaItem } from './ConsultaItem'
import { Carregando } from './Carregando'
import { CarregarMais } from './CarregarMais'
import { Erro } from './Erro'

export function ListaConsultas({ caminho, vazio = 'Nenhuma consulta aqui.', mostrarTutor = false }) {
  const consultas = usePaginado(caminho)

  if (consultas.erro) return <Erro erro={consultas.erro} tentarDeNovo={consultas.recarregar} />

  return (
    <>
      {!consultas.carregando && consultas.itens.length === 0 && <p className="text-secondary">{vazio}</p>}
      <ListGroup>
        {consultas.itens.map(consulta => (
          <ConsultaItem key={consulta.id} consulta={consulta} mostrarTutor={mostrarTutor} />
        ))}
      </ListGroup>
      {consultas.carregando ? <Carregando /> : <CarregarMais lista={consultas} />}
    </>
  )
}
