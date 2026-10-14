export function Foto({ src, icone = 'bi-person-circle', tamanho = 48, cor = 'text-muted' }) {
  if (src) {
    return (
      <img
        src={src}
        width={tamanho}
        height={tamanho}
        className="rounded-full object-cover align-middle"
        alt=""
      />
    )
  }
  return <i className={`bi ${icone} ${cor} align-middle`} style={{ fontSize: tamanho, lineHeight: 1 }}></i>
}
