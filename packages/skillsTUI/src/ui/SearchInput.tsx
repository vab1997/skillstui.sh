import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import { COLOR_GRAY } from '../constants.ts'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  isFocused: boolean
}

export function SearchInput({ value, onChange, onSubmit, isFocused }: Props) {
  return (
    <Box marginBottom={1}>
      <Text color={COLOR_GRAY}>{'Search: '}</Text>
      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder="type a skill name and press Enter..."
        focus={isFocused}
        showCursor={isFocused}
      />
    </Box>
  )
}
