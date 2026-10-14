import { useState } from 'react'
import { Alert, Button, Form, Input, Label, TextField } from '@heroui/react'
import { Link } from 'react-router-dom'
import { mensagemDeErro, redefinirSenha } from '../api/client'

export function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    try {
      await redefinirSenha(email)
      setEnviado(true)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  return (
    <>
      <h2 className="mb-4">Esqueci minha senha</h2>
      {enviado ? (
        <Alert status="success">
          Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit} className="space-y-4">
          {erro && <Alert status="danger">{erro}</Alert>}
          <TextField name="email" type="email" value={email} onChange={setEmail} isRequired>
            <Label>E-mail</Label>
            <Input />
          </TextField>
          <Button type="submit" variant="primary" fullWidth>Enviar link</Button>
        </Form>
      )}
      <Link to="/login" className="block mt-3">Voltar para o login</Link>
    </>
  )
}
