import { Tabs } from '@heroui/react'
import { ListaConsultas } from '../components/ListaConsultas'
import { hoje, somarDias } from '../formatos'

export function MinhasConsultas() {
  return (
    <>
      <h2 className="mb-4">Minhas consultas</h2>
      <Tabs defaultSelectedKey="proximos" className="mb-3">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Consultas">
            <Tabs.Tab id="proximos">Próximos</Tabs.Tab>
            <Tabs.Tab id="historico">Histórico</Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="proximos">
          <ListaConsultas caminho={`/agendamentos/?data_inicio=${hoje()}`} />
        </Tabs.Panel>
        <Tabs.Panel id="historico">
          <ListaConsultas caminho={`/agendamentos/?data_fim=${somarDias(hoje(), -1)}&ordering=-inicio`} />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
