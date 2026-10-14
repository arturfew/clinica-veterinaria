/*
 * Barra de navegação própria do app.
 *
 * O HeroUI v3 não inclui um componente <Navbar>: a recomendação oficial é
 * compor a barra com HTML nativo + utilitários do Tailwind sobre os tokens
 * do tema.
 *
 * Visual escolhido para a clínica: barra sólida na cor principal da marca
 * (azul-marinho), de largura total e fixa no topo, com o laranja da marca
 * destacando o item ativo — uma identidade própria, diferente da barra
 * "flutuante" translúcida do projeto que serviu de referência.
 */
export function Navbar({ children, menu }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-accent text-accent-foreground shadow-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4">
        {children}
      </nav>
      {menu}
    </header>
  )
}
