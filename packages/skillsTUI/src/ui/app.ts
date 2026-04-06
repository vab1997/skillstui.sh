import {
  BoxRenderable,
  InputRenderableEvents,
  ScrollBoxRenderable,
  TextRenderable,
  createCliRenderer,
} from '@opentui/core'
import {
  COLOR_BLACK,
  COLOR_FOCUSED_BACKGROUND,
  COLOR_GRAY,
  COLOR_WHITE,
  LOGO_LINES,
  RESULTS_PLACEHOLDER_ID,
  SUBTITLE_LINES,
} from '../constants'
import { createAgentSelectorController } from './agent-selector'
import { globalCopyToClipboard } from './copy-to-clipboard'
import { createInstallPanelController, installPanel } from './install-panel'
import { LabeledInput } from './labeled-input'
import { createSelectionPanelController } from './selection-panel'
import { createSkillSearchHandler } from './skill-search-handler'
import type { Renderer } from './types'

type AppPanels = {
  renderer: Renderer
  app: BoxRenderable
  skillSearch: ReturnType<typeof LabeledInput>
  resultsPanel: BoxRenderable
  resultsStatus: TextRenderable
  resultsScroll: ScrollBoxRenderable
  agentSelectorController: ReturnType<typeof createAgentSelectorController>
  selectionPanelController: ReturnType<typeof createSelectionPanelController>
  installPanelController: ReturnType<typeof createInstallPanelController>
}

function createSearchPanel(renderer: Renderer) {
  const skillSearch = LabeledInput(renderer, {
    id: 'skill',
    label: 'Skills leaderboard: ',
    placeholder: 'Search skills...',
  })

  const resultsStatus = new TextRenderable(renderer, {
    content: 'Press Enter to search for skills.',
    fg: COLOR_GRAY,
  })

  const resultsScroll = new ScrollBoxRenderable(renderer, {
    height: 20,
    scrollY: true,
    scrollX: false,
    scrollbarOptions: {
      trackOptions: { backgroundColor: COLOR_FOCUSED_BACKGROUND },
    },
  })
  resultsScroll.add(
    new TextRenderable(renderer, {
      id: RESULTS_PLACEHOLDER_ID,
      content: 'Results will appear here.',
      fg: COLOR_WHITE,
    }),
  )

  const resultsPanel = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    borderColor: COLOR_WHITE,
    padding: 1,
    flexDirection: 'column',
    gap: 1,
    title: 'Results',
  })
  resultsPanel.add(resultsStatus)
  resultsPanel.add(resultsScroll)

  return { skillSearch, resultsStatus, resultsScroll, resultsPanel }
}

function wireSearchHandler(renderer: Renderer, panels: AppPanels) {
  const { skillSearch, resultsScroll, resultsStatus, selectionPanelController } =
    panels
  skillSearch.input.focus()
  skillSearch.input.on(
    InputRenderableEvents.ENTER,
    createSkillSearchHandler({
      renderer,
      resultsScroll,
      resultsStatus,
      selectedSkills: selectionPanelController.selectedSkills,
      toggleSkill: selectionPanelController.toggleSkill,
    }),
  )
}

function wireHotkeys(panels: AppPanels) {
  const {
    renderer,
    app,
    selectionPanelController,
    agentSelectorController,
    installPanelController,
  } = panels

  renderer._internalKeyInput.on('keypress', (key) => {
    // Ctrl+Y: copy install commands to clipboard
    globalCopyToClipboard(
      key,
      selectionPanelController.selectedSkills,
      selectionPanelController.selectionStatus,
      selectionPanelController.getCommandText,
    )

    // Ctrl+I: install selected skills for selected agents
    const skills = [...selectionPanelController.selectedSkills.values()]
    const additionalAgents = [
      ...agentSelectorController.selectedAdditionalAgents.values(),
    ]
    installPanel(key, installPanelController, skills, additionalAgents, app)
  })
}

function buildLayout(renderer: Renderer, panels: AppPanels): BoxRenderable {
  const {
    skillSearch,
    resultsPanel,
    agentSelectorController,
    selectionPanelController,
  } = panels

  const app = new BoxRenderable(renderer, {
    borderStyle: 'rounded',
    padding: 1,
    flexDirection: 'column',
    gap: 1,
    backgroundColor: COLOR_BLACK,
    borderColor: COLOR_WHITE,
  })

  app.add(
    new TextRenderable(renderer, {
      content: LOGO_LINES.join('\n'),
      fg: COLOR_WHITE,
    }),
  )
  app.add(
    new TextRenderable(renderer, {
      content: SUBTITLE_LINES.toUpperCase(),
      fg: COLOR_WHITE,
    }),
  )
  app.add(skillSearch.field)
  app.add(resultsPanel)
  app.add(agentSelectorController.panel)
  app.add(selectionPanelController.panel)
  app.add(
    new TextRenderable(renderer, {
      content: '[Ctrl+C] to exit · [Ctrl+Y] to copy · [Ctrl+I] to install',
      fg: COLOR_GRAY,
    }),
  )

  return app
}

export async function startApp() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    useMouse: true,
    autoFocus: true,
    targetFps: 30,
  })

  const { skillSearch, resultsStatus, resultsScroll, resultsPanel } =
    createSearchPanel(renderer)

  // Agent selector and selection panel share state — selector notifies panel on toggle
  let selectionPanelController: ReturnType<typeof createSelectionPanelController>
  const agentSelectorController = createAgentSelectorController(renderer, () =>
    selectionPanelController.refreshCommand(),
  )
  selectionPanelController = createSelectionPanelController(renderer, () => [
    ...agentSelectorController.selectedAdditionalAgents.values(),
  ])

  const installPanelController = createInstallPanelController(renderer)

  // Assemble panels object — app is built after so we use a placeholder here
  const panels: AppPanels = {
    renderer,
    app: null as unknown as BoxRenderable, // assigned below
    skillSearch,
    resultsPanel,
    resultsStatus,
    resultsScroll,
    agentSelectorController,
    selectionPanelController,
    installPanelController,
  }

  const app = buildLayout(renderer, panels)
  panels.app = app

  wireSearchHandler(renderer, panels)
  wireHotkeys(panels)

  renderer.root.add(app)
}
