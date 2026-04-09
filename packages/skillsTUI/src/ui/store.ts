import type { Agent } from './agents.ts'
import type { Skill } from './types.ts'

export type PanelFocus = 'search' | 'skills' | 'agents'

export interface State {
  query: string
  lastQuery: string
  results: Skill[]
  isLoading: boolean
  error: string | null
  selectedSkills: Map<string, Skill>
  selectedAgents: Map<string, Agent>
  focusedPanel: PanelFocus
  focusedSkillIndex: number
  focusedAgentIndex: number
  isInstalling: boolean
  copyStatus: 'idle' | 'success' | 'error'
}

export type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_LAST_QUERY'; payload: string }
  | { type: 'SET_RESULTS'; payload: Skill[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_SKILL'; payload: Skill }
  | { type: 'TOGGLE_AGENT'; payload: Agent }
  | { type: 'SET_FOCUS'; payload: PanelFocus }
  | { type: 'SET_SKILL_INDEX'; payload: number }
  | { type: 'SET_AGENT_INDEX'; payload: number }
  | { type: 'START_INSTALL' }
  | { type: 'SET_COPY_STATUS'; payload: 'idle' | 'success' | 'error' }

export function getInitialState(): State {
  return {
    query: 'vercel',
    lastQuery: 'vercel',
    results: [],
    isLoading: false,
    error: null,
    selectedSkills: new Map(),
    selectedAgents: new Map(),
    focusedPanel: 'search',
    focusedSkillIndex: 0,
    focusedAgentIndex: 0,
    isInstalling: false,
    copyStatus: 'idle',
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload }

    case 'SET_LAST_QUERY':
      return { ...state, lastQuery: action.payload }

      case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        isLoading: false,
        error: null,
        focusedSkillIndex: 0,
      }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }

    case 'TOGGLE_SKILL': {
      const next = new Map(state.selectedSkills)
      if (next.has(action.payload.id)) {
        next.delete(action.payload.id)
      } else {
        next.set(action.payload.id, action.payload)
      }
      return { ...state, selectedSkills: next }
    }

    case 'TOGGLE_AGENT': {
      const next = new Map(state.selectedAgents)
      if (next.has(action.payload.value)) {
        next.delete(action.payload.value)
      } else {
        next.set(action.payload.value, action.payload)
      }
      return { ...state, selectedAgents: next }
    }

    case 'SET_FOCUS':
      return { ...state, focusedPanel: action.payload }

    case 'SET_SKILL_INDEX':
      return { ...state, focusedSkillIndex: action.payload }

    case 'SET_AGENT_INDEX':
      return { ...state, focusedAgentIndex: action.payload }

    case 'START_INSTALL':
      return { ...state, isInstalling: true }

    case 'SET_COPY_STATUS':
      return { ...state, copyStatus: action.payload }

    default:
      return state
  }
}
