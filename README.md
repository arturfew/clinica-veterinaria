# Clínica Veterinária (web)

App da disciplina de POS: cliente web em React para a API de agendamentos

Feito a partir do *template* React do Vite, com [HeroUI v3](https://www.heroui.com/) (sobre [Tailwind CSS v4](https://tailwindcss.com/)), [Bootstrap Icons](https://icons.getbootstrap.com/) e [React Router](https://reactrouter.com/).

O app e a API são independentes: o app é só um site estático que conversa com a API pela internet.

## Rodando

- Instale as dependências:
    - `npm install`
- Copie o arquivo de exemplo de variáveis de ambiente:
    - `cp .env.example .env`
- Preencha o `.env` com o endereço da API e o slug da organização:
    - `VITE_API_URL`: endereço da API, terminando em `/api`;
    - `VITE_ORGANIZACAO`: slug da organização usada no cadastro e no login (`clinica-veterinaria`).
- Rode o app:
    - `npm run dev`
- Acesse http://localhost:5173

As variáveis são lidas pelo Vite (`import.meta.env`) em `src/api/client.js`. O `.env` não vai para o git.

## Publicando na Vercel

- Importe o repositório na [Vercel](https://vercel.com/): ela reconhece o projeto Vite sozinha (`npm run build`, pasta `dist`);
- Em **Environment Variables**, defina `VITE_API_URL` e `VITE_ORGANIZACAO`;
- Faça o *deploy*.

As variáveis são lidas no momento do *build*: ao trocar alguma, faça o *deploy* de novo.

O `vercel.json` faz todas as rotas abrirem o `index.html`. Sem ele, recarregar a página em um endereço como `/consultas/9` daria erro 404, porque essas rotas só existem dentro do React (React Router).

## Organização do código

```
src/
├── api/client.js      # fetch com o token, renovação automática e mensagens de erro
├── AuthContext.js     # contexto com o usuário logado e as permissões (useAuth)
├── AuthProvider.jsx   # login, logout e carregamento do usuário
├── hooks/useApi.js    # useApi (buscar dados) e usePaginado (listas com "Carregar mais")
├── formatos.js        # datas, horas e preços em pt-BR
├── heroui.css         # import do tema do HeroUI + cores da marca + tipografia
├── components/        # peças reutilizadas: Menu, Layout, Erro, Carregando, ConsultaItem...
└── pages/             # uma tela por arquivo
    ├── agendar/       # fluxo de agendamento (C2 a C6)
    └── admin/         # telas do administrador (A1 a A10)
```

As telas seguem os identificadores da especificação (E1, C1, A1...). O menu e os botões aparecem conforme as `permissoes` do usuário (`pode('api.confirmar_agendamento')`), nunca pelo nome do grupo.

## Componentes e cores

Os componentes vêm do **[HeroUI v3](https://www.heroui.com/)** (`@heroui/react`), cujos estilos ficam no pacote separado `@heroui/styles`. O HeroUI v3 não usa mais o `<HeroUIProvider>` (isso era do v2) e é construído sobre o Tailwind CSS v4 — por isso o `vite.config.js` inclui o plugin `@tailwindcss/vite`.

Componentes usados: `Alert`, `Button`, `Card`, `Checkbox`, `Chip`, `Description`, `Dropdown`, `FieldError`, `Form`, `Input`, `InputGroup`, `Label`, `ListBox`, `Modal`, `Select`, `Spinner`, `Switch`, `Tabs`, `TextArea` e `TextField`. O helper `buttonVariants` (de `@heroui/styles`) permite estilizar um `<Link>` como botão. Os ícones continuam sendo do *Bootstrap Icons* (`bi bi-...`).

As cores e a tipografia da marca ficam em `src/heroui.css`, que importa o tema do HeroUI e sobrescreve os *tokens* de cor (`--accent` é o azul-marinho `#0a2f5f`; `--warning`, o laranja `#f89800`) e a fonte (`Nunito`):

```css
@import "@heroui/styles";

:root {
  --accent: #0a2f5f;   /* azul-marinho da marca */
  --warning: #f89800;  /* laranja da marca */
}
```

Veja os outros *tokens* em `node_modules/@heroui/styles/dist/themes/default/variables.css`.
