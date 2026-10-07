// Cliente único da API: token, renovação automática no 401 e erros padronizados.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://agendamentos.spaincentral.cloudapp.azure.com/api'
export const ORGANIZACAO = 'clinica-veterinaria'

const KEY = 'tokens'

export const tokens = {
  get: () => JSON.parse(localStorage.getItem(KEY) || 'null'),
  set: (t) => localStorage.setItem(KEY, JSON.stringify(t)),
  clear: () => localStorage.removeItem(KEY),
}

// Erro com status e mensagens: { campos: {campo: [msg]}, geral: [msg] }
export class ApiError extends Error {
  constructor(status, data) {
    super(mensagemPadrao(status, data))
    this.status = status
    this.campos = {}
    this.geral = []
    if (Array.isArray(data)) this.geral = data
    else if (data && typeof data === 'object') {
      for (const [k, v] of Object.entries(data)) {
        const msgs = Array.isArray(v) ? v : [String(v)]
        if (k === 'detail' || k === 'non_field_errors') this.geral.push(...msgs)
        else this.campos[k] = msgs
      }
    }
  }
}

function mensagemPadrao(status, data) {
  if (status === 403) return 'Você não tem permissão para esta ação'
  if (status === 404) return 'Não encontrado'
  if (status === 429) return 'Muitas tentativas, aguarde um minuto'
  if (data?.detail) return data.detail
  if (Array.isArray(data) && data[0]) return data[0]
  if (status === 400) return 'Confira os dados informados'
  return 'Não foi possível completar a requisição'
}

// Chamado quando a renovação falha: o AuthContext volta para o login.
let aoExpirar = () => {}
export const definirAoExpirar = (fn) => (aoExpirar = fn)

let renovando = null
async function renovar() {
  const t = tokens.get()
  if (!t?.refresh) throw new Error('sem refresh')
  const r = await fetch(`${API_URL}/auth/renovar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: t.refresh }),
  })
  if (!r.ok) throw new Error('refresh inválido')
  const novo = await r.json()
  tokens.set({ ...t, ...novo })
}

async function enviar(path, { method = 'GET', body, params, auth = true } = {}) {
  const qs = params
    ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
      )
    : ''
  const headers = {}
  const t = tokens.get()
  if (auth && t?.access) headers.Authorization = `Bearer ${t.access}`
  // FormData (upload de imagem): o navegador define o Content-Type sozinho.
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }
  return fetch(`${API_URL}${path}${qs}`, { method, headers, body })
}

export async function api(path, opts = {}) {
  let resp = await enviar(path, opts)
  if (resp.status === 401 && opts.auth !== false && tokens.get()?.refresh) {
    try {
      renovando ??= renovar().finally(() => (renovando = null))
      await renovando
      resp = await enviar(path, opts)
    } catch {
      tokens.clear()
      aoExpirar()
      throw new ApiError(401, { detail: 'Sessão expirada. Entre novamente.' })
    }
  }
  const data = resp.status === 204 ? null : await resp.json().catch(() => null)
  if (!resp.ok) throw new ApiError(resp.status, data)
  return data
}

// Atalhos
api.get = (path, params) => api(path, { params })
api.post = (path, body, opts) => api(path, { ...opts, method: 'POST', body })
api.patch = (path, body) => api(path, { method: 'PATCH', body })
api.delete = (path) => api(path, { method: 'DELETE' })

// Busca todas as páginas de uma lista paginada ({ results, next }).
export async function listarTudo(path, params = {}) {
  let page = 1
  const itens = []
  for (;;) {
    const d = await api.get(path, { ...params, page })
    if (Array.isArray(d)) return d
    itens.push(...d.results)
    if (!d.next) return itens
    page += 1
  }
}