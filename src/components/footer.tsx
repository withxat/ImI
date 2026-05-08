export const Footer = () => {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-xs tracking-[0.14em] text-[var(--page-muted)] sm:px-6 lg:px-8">
        <span className="pointer-events-auto">Built with Waku and Tailwind</span>
        <div className="pointer-events-auto">
          visit{' '}
          <a
            href="https://waku.gg/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[var(--page-accent-strong)] decoration-1 underline-offset-4 transition-colors duration-150 hover:text-[var(--page-ink)]"
          >
            waku.gg
          </a>{' '}
          to learn more
        </div>
      </div>
    </footer>
  );
};
