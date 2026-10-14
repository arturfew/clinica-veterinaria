import { Button, Modal } from '@heroui/react'

export function Confirmacao({ show, titulo, mensagem, textoConfirmar = 'Confirmar', variante = 'primary', onConfirmar, onFechar }) {
  return (
    <Modal isOpen={show} onOpenChange={open => { if (!open) onFechar() }}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{titulo}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>{mensagem}</Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={onFechar}>Voltar</Button>
              <Button variant={variante} onPress={onConfirmar}>{textoConfirmar}</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
