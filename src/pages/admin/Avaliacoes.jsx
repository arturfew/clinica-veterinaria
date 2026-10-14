import { useState } from 'react'
import { ListBox, Select } from '@heroui/react'
import { buscarTodas } from '../../api/client'
import { Avaliacao } from '../../components/Avaliacao'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { useApi, usePaginado } from '../../hooks/useApi'

export function Avaliacoes() {
  const [recurso, setRecurso] = useState('')
  const [nota, setNota] = useState('')
  const recursos = useApi('/recursos/', buscarTodas)

  const filtros = new URLSearchParams()
  if (recurso) filtros.set('recurso', recurso)
  if (nota) filtros.set('nota', nota)
  const avaliacoes = usePaginado(`/avaliacoes/?${filtros}`)

  return (
    <>
      <h2 className="mb-4">Avaliações</h2>
      <div className="mb-4 grid gap-2 md:grid-cols-3">
        <div className="md:col-span-2">
          <Select
            aria-label="Veterinário"
            placeholder="Todos os veterinários"
            selectedKey={recurso ? String(recurso) : 'todos'}
            onSelectionChange={k => setRecurso(k === 'todos' || k === null ? '' : k)}
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
        <div>
          <Select
            aria-label="Nota"
            placeholder="Todas as notas"
            selectedKey={nota ? String(nota) : 'todos'}
            onSelectionChange={k => setNota(k === 'todos' || k === null ? '' : k)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="todos" textValue="Todas as notas">Todas as notas</ListBox.Item>
                {[5, 4, 3, 2, 1].map(n => (
                  <ListBox.Item key={n} id={String(n)} textValue={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}>
                    {n} {n === 1 ? 'estrela' : 'estrelas'}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {avaliacoes.erro && <Erro erro={avaliacoes.erro} tentarDeNovo={avaliacoes.recarregar} />}
      {!avaliacoes.carregando && !avaliacoes.erro && avaliacoes.itens.length === 0 && (
        <p className="text-muted">Ainda sem avaliações.</p>
      )}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {avaliacoes.itens.map(avaliacao => (
          <Avaliacao key={avaliacao.id} avaliacao={avaliacao} />
        ))}
      </div>
      {avaliacoes.carregando ? <Carregando /> : <CarregarMais lista={avaliacoes} />}
    </>
  )
}
