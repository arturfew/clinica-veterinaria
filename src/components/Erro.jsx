import { Alert, Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { mensagemDeErro } from '../api/client'

export function Erro({ erro, tentarDeNovo }) {
  const navigate = useNavigate()

  return (
    <Alert status="danger" className="flex items-center">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {mensagemDeErro(erro)}
      {erro.status === 404 ? (
        <Button variant="danger-soft" size="sm" className="ms-auto" onPress={() => navigate(-1)}>
          Voltar
        </Button>
      ) : (
        <Button variant="danger-soft" size="sm" className="ms-auto" onPress={tentarDeNovo}>
          Tentar de novo
        </Button>
      )}
    </Alert>
  )
}
