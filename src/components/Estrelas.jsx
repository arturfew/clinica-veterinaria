export function Estrelas({ nota }) {
  return (
    <span className="text-yellow-500">
      {[1, 2, 3, 4, 5].map(n => (
        <i key={n} className={n <= nota ? 'bi bi-star-fill' : 'bi bi-star'}></i>
      ))}
    </span>
  )
}
