import { Button, InputGroup } from '@heroui/react'
import { somarDias } from '../formatos'

export function SeletorData({ data, onChange, min }) {
  return (
    <InputGroup className="mb-4">
      <InputGroup.Prefix>
        <Button variant="ghost" isIconOnly onPress={() => onChange(somarDias(data, -1))} isDisabled={min && data <= min}>
          <i className="bi bi-chevron-left"></i>
        </Button>
      </InputGroup.Prefix>
      <InputGroup.Input type="date" value={data} min={min} onChange={e => onChange(e.target.value)} />
      <InputGroup.Suffix>
        <Button variant="ghost" isIconOnly onPress={() => onChange(somarDias(data, 1))}>
          <i className="bi bi-chevron-right"></i>
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  )
}
