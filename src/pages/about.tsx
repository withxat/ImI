import { Link } from 'waku';

export default async function AboutPage() {
  const data = await getData();

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-28 sm:px-6 lg:px-8">
      <div className="w-full border border-[var(--page-border)] bg-[color:color-mix(in_srgb,var(--page-surface)_92%,white)] p-6 shadow-[0_18px_60px_rgba(16,23,20,0.1)] backdrop-blur-sm sm:p-8">
        <title>{data.title}</title>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--page-muted)]">
          About
        </p>
        <h1 className="max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-[var(--page-ink)]">
          {data.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[var(--page-muted)] sm:text-base">
          {data.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-[var(--page-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--page-ink)] transition duration-150 ease-out hover:-translate-y-0.5 hover:border-[var(--page-accent-strong)] hover:bg-white active:scale-95"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}

const getData = async () => {
  const data = {
    title: 'About',
    headline: 'The page shell is now doing more of the storytelling.',
    body:
      'Rather than centering a minimal starter block, the about page follows the same softer editorial system as the homepage: stepped surface depth, fluid type, and enough breathing room to stay readable at mobile width.',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
