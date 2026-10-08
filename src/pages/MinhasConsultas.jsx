import { Tab, Tabs } from 'react-bootstrap'
import { ListaConsultas } from '../components/ListaConsultas'
import { hoje, somarDias } from '../formatos'

export function MinhasConsultas() {
  return (
    <>
      <h2 className="mb-4">Minhas consultas</h2>
      <Tabs defaultActiveKey="proximos" className="mb-3" mountOnEnter>
        <Tab eventKey="proximos" title="Próximos">
          <ListaConsultas caminho={`/agendamentos/?data_inicio=${hoje()}`} />
        </Tab>
        <Tab eventKey="historico" title="Histórico">
          <ListaConsultas caminho={`/agendamentos/?data_fim=${somarDias(hoje(), -1)}&ordering=-inicio`} />
        </Tab>
      </Tabs>
    </>
  )
}
