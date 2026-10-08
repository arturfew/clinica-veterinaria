import { Alert, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { buscarTodas } from '../../api/client'
import { ConsultaItem } from '../../components/ConsultaItem'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { SeletorData } from '../../components/SeletorData'
import { hoje } from '../../formatos'
import { useApi } from '../../hooks/useApi'

export function Agenda() {
  const [params, setParams] = useSearchParams()
  const data = params.get('data') ?? hoje()
  const recurso = params.get('recurso') ?? ''

  let caminho = `/agendamentos/?data_inicio=${data}&data_fim=${data}`
  if (recurso) {
    caminho += `&recurso=${recurso}`
  }
  const consultas = useApi(caminho, buscarTodas)
  const recursos = useApi('/recursos/', buscarTodas)

  function mudar(nome, valor) {
    const novos = new URLSearchParams(params)
    novos.set(nome, valor)
    setParams(novos, { replace: true })
  }

  return (
    <>
      <h2 className="mb-4">Agenda do dia</h2>
      <Row>
        <Col md={6}>
          <SeletorData data={data} onChange={valor => mudar('data', valor)} />
        </Col>
        <Col md={6}>
          <Form.Select className="mb-4" value={recurso} onChange={e => mudar('recurso', e.target.value)}>
            <option value="">Todos os veterinários</option>
            {recursos.dados?.map(r => (
              <option key={r.id} value={r.id}>{r.nome}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {consultas.erro && <Erro erro={consultas.erro} tentarDeNovo={consultas.recarregar} />}
      {consultas.carregando && <Carregando />}
      {consultas.dados?.length === 0 && <Alert variant="info">Nenhuma consulta neste dia.</Alert>}
      <ListGroup>
        {consultas.dados?.map(consulta => (
          <ConsultaItem key={consulta.id} consulta={consulta} mostrarTutor />
        ))}
      </ListGroup>
    </>
  )
}
