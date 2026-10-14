import { useState } from 'react'
import { Alert, Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { api, mensagemDeErro } from '../api/client'

export function AlterarSenha() {
  const navigate = useNavigate()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})

    // a API não recebe a confirmação: ela é conferida só aqui
    if (novaSenha !== confirmacao) {
      setErros({ confirmacao: ['As senhas não conferem.'] })
      return
    }

    setEnviando(true)
    try {
      await api('/auth/alterar-senha/', {
        method: 'POST',
        body: { senha_atual: senhaAtual, nova_senha: novaSenha },
      })
      navigate('/perfil', { state: { mensagem: 'Senha alterada.' } })
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
      setEnviando(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <Card>
          <Card.Content>
            <h2 className="mb-4">Alterar senha</h2>
            {erro && <Alert status="danger">{erro}</Alert>}
            <Form onSubmit={handleSubmit} className="space-y-4">
              <TextField name="senhaAtual" type="password" value={senhaAtual} onChange={setSenhaAtual} isRequired isInvalid={!!erros.senha_atual}>
                <Label>Senha atual</Label>
                <Input />
                <FieldError>{erros.senha_atual?.join(' ')}</FieldError>
              </TextField>
              <TextField name="novaSenha" type="password" value={novaSenha} onChange={setNovaSenha} isRequired isInvalid={!!erros.nova_senha}>
                <Label>Nova senha</Label>
                <Input />
                <FieldError>{erros.nova_senha?.join(' ')}</FieldError>
              </TextField>
              <TextField name="confirmacao" type="password" value={confirmacao} onChange={setConfirmacao} isRequired isInvalid={!!erros.confirmacao}>
                <Label>Confirme a nova senha</Label>
                <Input />
                <FieldError>{erros.confirmacao?.join(' ')}</FieldError>
              </TextField>
              <div className="flex gap-2">
                <Button variant="ghost" onPress={() => navigate('/perfil')}>Cancelar</Button>
                <Button type="submit" variant="primary" isDisabled={enviando}>Salvar</Button>
              </div>
            </Form>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
