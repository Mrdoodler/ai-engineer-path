import { GithubIcon, REPO_URL } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:px-6">
        <p>
          Built on the{" "}
          <a className="text-fg underline decoration-white/20 underline-offset-4 hover:decoration-white" href="https://roadmap.sh/ai-engineer" target="_blank" rel="noreferrer">
            roadmap.sh AI Engineer
          </a>{" "}
          roadmap. Progress is saved in your browser.
        </p>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
          <GithubIcon className="size-4" /> Source
        </a>
      </div>
    </footer>
  );
}
