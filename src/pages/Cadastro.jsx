import { useState } from 'react'
import { Alert, Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Link } from 'react-router-dom'
import { cadastrar, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'

export function Cadastro() {
  const { entrar } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    setErros({})
    try {
      await cadastrar(nome, email, senha)
      await entrar(email, senha)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
      setEnviando(false)
    }
  }

  return (
    <>
      <h2 className="mb-4">Criar conta</h2>
      {erro && <Alert status="danger">{erro}</Alert>}
      <Form onSubmit={handleSubmit} className="space-y-4">
        <TextField name="nome" value={nome} onChange={setNome} isRequired isInvalid={!!erros.nome}>
          <Label>Nome</Label>
          <Input />
          <FieldError>{erros.nome?.join(' ')}</FieldError>
        </TextField>
        <TextField name="email" type="email" value={email} onChange={setEmail} isRequired isInvalid={!!erros.email}>
          <Label>E-mail</Label>
          <Input />
          <FieldError>{erros.email?.join(' ')}</FieldError>
        </TextField>
        <TextField name="senha" type="password" value={senha} onChange={setSenha} isRequired isInvalid={!!erros.senha}>
          <Label>Senha</Label>
          <Input />
          <FieldError>{erros.senha?.join(' ')}</FieldError>
        </TextField>
        <Button type="submit" variant="primary" fullWidth isDisabled={enviando}>Criar conta</Button>
      </Form>
      <p className="mt-3 mb-0">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </>
  )
}
