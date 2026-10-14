import { useState } from 'react'
import { Alert, Chip } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { FiltroAtivo } from '../../components/FiltroAtivo'
import { formatarPreco } from '../../formatos'
import { usePaginado } from '../../hooks/useApi'

export function Servicos() {
  const [ativo, setAtivo] = useState('')
  const servicos = usePaginado(ativo ? `/servicos/?ativo=${ativo}` : '/servicos/')

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="me-auto mb-0">Serviços</h2>
        <FiltroAtivo valor={ativo} onChange={setAtivo} />
        <Link to="/admin/servicos/novo" className={buttonVariants({ variant: 'primary' })}>
          <i className="bi bi-plus-lg"></i> Novo serviço
        </Link>
      </div>

      {servicos.erro && <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />}
      {!servicos.carregando && !servicos.erro && servicos.itens.length === 0 && (
        <Alert status="accent">Cadastre o primeiro serviço.</Alert>
      )}
      <div className="divide-y divide-separator overflow-hidden rounded-xl border border-separator bg-surface shadow-sm">
        {servicos.itens.map(servico => (
          <Link
            key={servico.id}
            to={`/admin/servicos/${servico.id}`}
            className="flex items-center gap-3 p-3 text-inherit no-underline hover:bg-default/50"
          >
            {servico.imagem ? (
              <img src={servico.imagem} width={64} className="rounded" />
            ) : (
              <i className="bi bi-heart-pulse text-2xl text-muted"></i>
            )}
            <div className="me-auto">
              <div className="font-semibold">{servico.nome}</div>
              <small className="text-muted">
                {servico.duracao_min} min · {formatarPreco(servico.preco)}
              </small>
            </div>
            {servico.ativo ? <Chip color="success" variant="soft">Ativo</Chip> : <Chip color="default" variant="soft">Inativo</Chip>}
          </Link>
        ))}
      </div>
      {servicos.carregando ? <Carregando /> : <CarregarMais lista={servicos} />}
    </>
  )
}
