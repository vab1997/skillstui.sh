import { BoxRenderable, InputRenderable, TextRenderable } from '@opentui/core'
import {
  COLOR_BACKGROUND,
  COLOR_FOCUSED_BACKGROUND,
  COLOR_GRAY,
  COLOR_WHITE,
} from '../constants'
import type { Renderer } from './types'

export function LabeledInput(
  renderer: Renderer,
  props: { id: string; label: string; placeholder: string },
) {
  const input = new InputRenderable(renderer, {
    id: `${props.id}-input`,
    placeholder: props.placeholder,
    width: 20,
    backgroundColor: COLOR_BACKGROUND,
    focusedBackgroundColor: COLOR_FOCUSED_BACKGROUND,
    textColor: COLOR_WHITE,
    cursorColor: COLOR_WHITE,
  })

  const field = new BoxRenderable(renderer, {
    flexDirection: 'row',
    marginBottom: 1,
  })

  field.add(
    new TextRenderable(renderer, {
      content: props.label.padEnd(20),
      fg: COLOR_GRAY,
    }),
  )
  field.add(input)

  return { field, input }
}
