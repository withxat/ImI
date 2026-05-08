import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h2 className="pointer-events-auto text-sm font-semibold uppercase tracking-[0.24em] text-[var(--page-muted)]">
          <Link to="/" className="transition-colors duration-150 hover:text-[var(--page-ink)]">
            IMI
          </Link>
        </h2>
        <p className="hidden pointer-events-auto text-xs tracking-[0.18em] text-[var(--page-muted)] sm:block">
          Adaptive interface notes
        </p>
      </div>
    </header>
  );
};
