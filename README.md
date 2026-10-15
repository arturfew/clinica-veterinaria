# Clínica Veterinária (web)

**Deploy:** [clinica-veterinaria-coral.vercel.app](https://clinica-veterinaria-coral.vercel.app)

Cliente web em React para a API de agendamentos, feito para a disciplina de Programação Orientada a Serviços (POS). O app é um cliente que conversa com a API pela internet: ele e a API são independentes.

## Resumo

Aplicação de agendamento para uma clínica veterinária, com dois perfis de uso:

- **Tutor:** cria conta, agenda consultas e vacinas para os seus pets, acompanha, cancela e avalia os atendimentos, e edita seu perfil;
- **Administrador:** gerencia a agenda do dia, confirma/conclui/cancela pedidos, cadastra veterinários, serviços e horários, cuida da marca do negócio e acompanha as avaliações.

O menu e as ações aparecem conforme as **permissões** do usuário (`pode('api.confirmar_agendamento')`), e não pelo nome do grupo.

## Stack

- [React 19](https://react.dev/) — biblioteca de UI
- [Vite 8](https://vite.dev/) — build e servidor de desenvolvimento
- [React Router 7](https://reactrouter.com/) — rotas do lado do cliente
- [HeroUI v3](https://www.heroui.com/) — biblioteca de componentes
- [Tailwind CSS v4](https://tailwindcss.com/) — utilitários de estilo (base do HeroUI)
- [Bootstrap Icons](https://icons.getbootstrap.com/) — ícones (`bi bi-...`)
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) — lint

## Biblioteca de componentes

Os componentes vêm do **[HeroUI v3](https://www.heroui.com/)** (`@heroui/react`), cujos estilos ficam no pacote separado `@heroui/styles`. O HeroUI v3 não usa mais o `<HeroUIProvider>` (isso era do v2) e é construído sobre o Tailwind CSS v4 — por isso o `vite.config.js` inclui o plugin `@tailwindcss/vite`.

Componentes usados: `Alert`, `Button`, `Card`, `Checkbox`, `Chip`, `Description`, `Dropdown`, `FieldError`, `Form`, `Input`, `InputGroup`, `Label`, `ListBox`, `Modal`, `Select`, `Spinner`, `Switch`, `Tabs`, `TextArea` e `TextField`. O helper `buttonVariants` (de `@heroui/styles`) permite estilizar `<Link>` como botão.

As cores e a tipografia da marca ficam em `src/heroui.css`, que importa o tema do HeroUI e sobrescreve os *tokens* de cor (`--accent` é o azul-marinho `#0a2f5f`; `--warning`, o laranja `#f89800`) e a fonte (`Nunito`):

```css
@import "@heroui/styles";

:root {
  --accent: #0a2f5f;   /* azul-marinho da marca */
  --warning: #f89800;  /* laranja da marca */
}
```

## Variáveis de ambiente

As variáveis são lidas pelo Vite em tempo de build, via `import.meta.env`, em `src/api/client.js`:

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | Endereço da API, terminando em `/api` |
| `VITE_ORGANIZACAO` | Slug da organização usada no cadastro e no login (`clinica-veterinaria`) |

O arquivo `.env` não vai para o git; use o `.env.example` como base.

## Funcionalidades

**Autenticação e conta**

- Entrada (tela inicial), login, cadastro e recuperação de senha;
- Renovação automática do token de acesso (refresh) e logout;
- Perfil: editar nome e foto, alterar senha.

**Tutor**

- Início com a próxima consulta e atalho para agendar;
- Fluxo de agendamento em passos: escolher serviço → veterinário → data e horário → confirmar → enviado;
- Minhas consultas divididas em "Próximos" e "Histórico" (com "Carregar mais");
- Detalhe da consulta com ações conforme permissão (cancelar);
- Lista e perfil de veterinários (com serviços e avaliações);
- Avaliar uma consulta concluída com nota (1 a 5 estrelas) e comentário.

**Administrador**

- Agenda do dia, filtrando por veterinário;
- "A confirmar": lista de pedidos com confirmar/cancelar;
- Detalhe da consulta com confirmar, concluir e cancelar;
- Avaliações, filtrando por veterinário e nota;
- Dados do negócio: nome, descrição e logo;
- Veterinários: cadastro/edição, ativação e horários de disponibilidade por dia da semana;
- Serviços: cadastro/edição com imagem, duração, preço e ativação.

## Tutorial para rodar

1. Instale as dependências:

```
npm install
```

2. Copie o arquivo de exemplo de variáveis de ambiente:

```
cp .env.example .env
```

3. Preencha o `.env`:

```
VITE_API_URL=https://agendamentos.spaincentral.cloudapp.azure.com/api
VITE_ORGANIZACAO=clinica-veterinaria
```

4. Rode o app:

```
npm run dev
```

5. Acesse [http://localhost:5173](http://localhost:5173)

### Publicando na Vercel

- Importe o repositório na [Vercel](https://vercel.com/): ela reconhece o projeto Vite sozinho (`npm run build`, pasta `dist`);
- Em **Environment Variables**, defina `VITE_API_URL` e `VITE_ORGANIZACAO`;
- Faça o deploy.

As variáveis são lidas no momento do build: ao trocar alguma, faça o deploy de novo.

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

## Inspiração

Este projeto foi construído a partir do repositório de exemplo **[dvcirilo-ifrn/pos-escola-de-musica-web](https://github.com/dvcirilo-ifrn/pos-escola-de-musica-web)**, da disciplina de POS do IFRN-SPP, adaptado do domínio de escola de música para o de clínica veterinária.
