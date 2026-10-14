import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'
import { Alert, Button, Form, Input, Label, TextField } from '@heroui/react'

export function Login() {
  const { entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await entrar(email, senha)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setEnviando(false)
    }
  }

  return (
    <>
      <h2 className="mb-4">Entrar</h2>
      {erro && <Alert status="danger">{erro}</Alert>}
      <Form onSubmit={handleSubmit} className="space-y-3">
        <TextField name="email" type="email" value={email} onChange={setEmail} isRequired>
          <Label>E-mail</Label>
          <Input />
        </TextField>
        <TextField name="senha" type="password" value={senha} onChange={setSenha} isRequired>
          <Label>Senha</Label>
          <Input />
        </TextField>
        <Button type="submit" variant="primary" isDisabled={enviando}>Entrar</Button>
      </Form>
      <div className="mt-3 flex justify-between">
        <Link to="/cadastro">Criar conta</Link>
        <Link to="/esqueci-senha">Esqueci minha senha</Link>
      </div>
    </>
  )
}