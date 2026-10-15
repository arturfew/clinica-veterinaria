export function Foto({ src, icone = 'bi-person-circle', tamanho = 48, cor = 'text-muted' }) {
  if (src) {
    // O tamanho vai no style (e não nos atributos width/height) porque o
    // Preflight do Tailwind aplica `height: auto` em toda <img>, o que
    // sobrepõe os atributos e deixa a imagem com a proporção original.
    // `inline-block` mantém a imagem centralizável por `text-align: center`.
    return (
      <img
        src={src}
        alt=""
        className="inline-block rounded-full object-cover align-middle"
        style={{ width: tamanho, height: tamanho, objectFit: 'cover' }}
      />
    )
  }
  return <i className={`bi ${icone} ${cor} align-middle`} style={{ fontSize: tamanho, lineHeight: 1 }}></i>
}
