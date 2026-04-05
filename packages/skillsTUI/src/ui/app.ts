import {
  BoxRenderable,
  InputRenderableEvents,
  ScrollBoxRenderable,
  TextRenderable,
  createCliRenderer,
} from "@opentui/core"
import { COLOR_BLACK, COLOR_FOCUSED_BACKGROUND, COLOR_GRAY, COLOR_WHITE, LOGO_LINES, SUBTITLE_LINES } from "../constants"
import { globalCopyToClipboard } from "./copy-to-clipboard"
import { createInstallPanelController, installPanel } from "./install-panel"
import { LabeledInput } from "./labeled-input"
import { createAgentSelectorController } from "./agent-selector"
import { createSkillSearchHandler } from "./skill-search-handler"
import { createSelectionPanelController } from "./selection-panel"

export async function startApp() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    useMouse: true,
    autoFocus: true,
    targetFps: 30,
  })

  // --- Search UI ---
  const skillSearch = LabeledInput(renderer, {
    id: "skill",
    label: "Skills leaderboard: ",
    placeholder: "Search skills...",
  })

  const resultsStatus = new TextRenderable(renderer, {
    content: "Press Enter to search for skills.",
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
      id: "results-placeholder",
      content: "Results will appear here.",
      fg: COLOR_WHITE,
    }),
  )

  const resultsPanel = new BoxRenderable(renderer, {
    borderStyle: "rounded",
    borderColor: COLOR_WHITE,
    padding: 1,
    flexDirection: "column",
    gap: 1,
    title: "Results",
  })
  resultsPanel.add(resultsStatus)
  resultsPanel.add(resultsScroll)

  // --- Agent selector + selection panel ---
  let selectionPanelController: ReturnType<typeof createSelectionPanelController>
  const agentSelectorController = createAgentSelectorController(
    renderer,
    () => selectionPanelController.refreshCommand(),
  )
  selectionPanelController = createSelectionPanelController(
    renderer,
    () => [...agentSelectorController.selectedAdditionalAgents.values()],
  )

  // --- Search handler ---
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

  // --- Install panel ---
  const installPanelController = createInstallPanelController(renderer)

  // --- Global hotkeys ---
  renderer._internalKeyInput.on("keypress", (key) => {
    // Ctrl+Y: copy install commands to clipboard
    globalCopyToClipboard(
      key,
      selectionPanelController.selectedSkills,
      selectionPanelController.selectionStatus,
      selectionPanelController.getCommandText,
    )

    // Ctrl+I: install selected skills for selected agents
    const skills = [...selectionPanelController.selectedSkills.values()]
    const additionalAgents = [...agentSelectorController.selectedAdditionalAgents.values()]
    installPanel(key, installPanelController, skills, additionalAgents, app)
  })

  // --- App layout ---
  const app = new BoxRenderable(renderer, {
    borderStyle: "rounded",
    padding: 1,
    flexDirection: "column",
    gap: 1,
    backgroundColor: COLOR_BLACK,
    borderColor: COLOR_WHITE,
  })

  app.add(
    new TextRenderable(renderer, {
      content: LOGO_LINES.join("\n"),
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
      content: "[Ctrl+C] to exit · [Ctrl+Y] to copy · [Ctrl+I] to install",
      fg: COLOR_GRAY,
    }),
  )

  renderer.root.add(app)
}
