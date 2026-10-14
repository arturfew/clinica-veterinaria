import { ListBox, Select } from '@heroui/react'

export function FiltroAtivo({ valor, onChange }) {
  return (
    <Select
      selectedKey={valor === '' ? 'todos' : String(valor)}
      onSelectionChange={key => {
        if (key === 'todos') {
          onChange('')
        } else {
          onChange(key)
        }
      }}
      className="w-auto"
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id="todos">Todos</ListBox.Item>
          <ListBox.Item id="true">Ativos</ListBox.Item>
          <ListBox.Item id="false">Inativos</ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
