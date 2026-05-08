import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="border-b border-[var(--page-border)] bg-[var(--page-bg)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-[var(--page-ink)]">
          <Link to="/" className="transition-colors duration-150 hover:text-black">
            IMI
          </Link>
        </h2>
        <p className="hidden text-sm text-[var(--page-muted)] sm:block">
          Simple responsive layout
        </p>
      </div>
    </header>
  );
};
