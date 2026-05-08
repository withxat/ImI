export const Footer = () => {
  return (
    <footer className="border-t border-[var(--page-border)] bg-[var(--page-bg)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-sm text-[var(--page-muted)] sm:px-6 lg:px-8">
        <span>Built with Waku and Tailwind</span>
        <div>
          visit{' '}
          <a
            href="https://waku.gg/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 transition-colors duration-150 hover:text-[var(--page-ink)]"
          >
            waku.gg
          </a>{' '}
          to learn more
        </div>
      </div>
    </footer>
  );
};
