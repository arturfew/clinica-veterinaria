// Estados padrão de toda tela com dados: carregando, erro e vazio.
export function Carregando() {
  return <p className="estado" role="status">Carregando…</p>
}

export function Erro({ erro, onRetry }) {
  return (
    <div className="estado erro" role="alert">
      <p>{erro?.message || 'Algo deu errado'}</p>
      {onRetry && <button onClick={onRetry}>Tentar de novo</button>}
    </div>
  )
}

export function Vazio({ children, acao }) {
  return (
    <div className="estado">
      <p>{children}</p>
      {acao}
    </div>
  )
}
