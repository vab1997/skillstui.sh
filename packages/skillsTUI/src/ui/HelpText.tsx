import { Box, Text } from 'ink'
import { memo } from 'react'
import { COLOR_GRAY } from '../constants.ts'

export const HelpText = memo(function HelpText() {
  return (
    <Box marginTop={1}>
      <Text color={COLOR_GRAY}>
        [Tab] next panel · [Shift+Tab] previous panel · [↑↓] move · [Space]
        select · [S] detail · [Ctrl+G] install · [Ctrl+Y] copy · [Ctrl+C] exit
      </Text>
    </Box>
  )
})
