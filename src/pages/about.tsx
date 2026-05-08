import { Link } from 'waku';

export default async function AboutPage() {
  const data = await getData();

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="w-full rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-6 sm:p-8">
        <title>{data.title}</title>
        <p className="mb-4 text-sm text-[var(--page-muted)]">
          About
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--page-ink)] sm:text-4xl">
          {data.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--page-muted)]">
          {data.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-[var(--page-ink)] underline underline-offset-4"
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
    headline: 'A trimmed-down version of the page shell.',
    body:
      'This page now matches the simplified direction from the homepage instead of carrying the heavier presentation treatment.',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
