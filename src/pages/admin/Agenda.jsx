import { Alert, ListBox, Select } from '@heroui/react'
import { useSearchParams } from 'react-router-dom'
import { buscarTodas } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { ConsultaItem } from '../../components/ConsultaItem'
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
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <SeletorData data={data} onChange={valor => mudar('data', valor)} />
        </div>
        <div>
          <Select
            className="mb-4"
            aria-label="Veterinário"
            placeholder="Todos os veterinários"
            selectedKey={recurso ? String(recurso) : 'todos'}
            onSelectionChange={k => mudar('recurso', k === 'todos' || k === null ? '' : k)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="todos" textValue="Todos os veterinários">Todos os veterinários</ListBox.Item>
                {recursos.dados?.map(r => (
                  <ListBox.Item key={r.id} id={String(r.id)} textValue={r.nome}>{r.nome}</ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {consultas.erro && <Erro erro={consultas.erro} tentarDeNovo={consultas.recarregar} />}
      {consultas.carregando && <Carregando />}
      {consultas.dados?.length === 0 && <Alert status="accent">Nenhuma consulta neste dia.</Alert>}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {consultas.dados?.map(consulta => (
          <ConsultaItem key={consulta.id} consulta={consulta} mostrarTutor />
        ))}
      </div>
    </>
  )
}
