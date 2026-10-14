import { useState } from 'react'
import { Alert, Chip } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { FiltroAtivo } from '../../components/FiltroAtivo'
import { Foto } from '../../components/Foto'
import { usePaginado } from '../../hooks/useApi'

export function Recursos() {
  const [ativo, setAtivo] = useState('')
  const recursos = usePaginado(ativo ? `/recursos/?ativo=${ativo}` : '/recursos/')

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="me-auto mb-0">Veterinários</h2>
        <FiltroAtivo valor={ativo} onChange={setAtivo} />
        <Link to="/admin/recursos/novo" className={buttonVariants({ variant: 'primary' })}>
          <i className="bi bi-plus-lg"></i> Novo veterinário
        </Link>
      </div>

      {recursos.erro && <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />}
      {!recursos.carregando && !recursos.erro && recursos.itens.length === 0 && (
        <Alert status="accent">Cadastre o primeiro veterinário.</Alert>
      )}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {recursos.itens.map(recurso => (
          <Link
            key={recurso.id}
            to={`/admin/recursos/${recurso.id}`}
            className="flex items-center gap-3 p-3 text-inherit no-underline hover:bg-default/50"
          >
            <Foto src={recurso.foto} tamanho={48} />
            <div className="me-auto">
              <div className="font-semibold">{recurso.nome}</div>
              <small className="text-muted">Capacidade: {recurso.capacidade}</small>
            </div>
            {recurso.ativo ? <Chip color="success" variant="soft">Ativo</Chip> : <Chip color="default" variant="soft">Inativo</Chip>}
          </Link>
        ))}
      </div>
      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}
