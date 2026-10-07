// Campo de formulário com a mensagem de erro da API ao lado.
export default function Campo({ label, erros, children, ...props }) {
  return (
    <label className="campo">
      <span>{label}</span>
      {children || <input {...props} />}
      {erros?.map((m) => (
        <small key={m} className="msg-erro">{m}</small>
      ))}
    </label>
  )
}