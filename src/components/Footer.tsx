import { IconGithub } from './Icons'

export const Footer = () => (
  <footer className="border-bd2 mt-5 border-t">
    <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6.5 py-5.5">
      <span className="text-dim font-sans text-[12px]">
        © 2026 jaipkg · A focused registry for the Jai community
      </span>
      <a
        href="https://github.com/MariuzM/jaipkg"
        target="_blank"
        rel="noreferrer"
        className="text-dim hover:text-mut inline-flex items-center gap-1.5 font-mono text-[12px] transition-colors"
      >
        <IconGithub size={13} />
        GitHub
      </a>
    </div>
  </footer>
)
