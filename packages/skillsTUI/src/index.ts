import { startApp } from "./ui/app"

async function main() {
  await startApp()
}

void main().catch((error) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});