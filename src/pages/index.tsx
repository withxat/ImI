import { Link } from 'waku';
import { HorizontalFade, VerticalFade } from '../components/fades';

type Note = {
  title: string;
  body: string;
};

export default async function HomePage() {
  const data = await getData();

  return (
    <div className="relative isolate overflow-x-clip">
      <title>{data.title}</title>

      <VerticalFade side="top" height={280} />
      <VerticalFade side="bottom" height={120} className="z-30" />
      <HorizontalFade side="left" />
      <HorizontalFade side="right" />

      <div
        aria-hidden
        className="pointer-events-none fixed left-[max(1rem,calc(50%-26rem))] top-0 hidden h-screen w-px bg-linear-to-b from-[var(--page-accent)] to-transparent opacity-80 lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed right-[max(1rem,calc(50%-26rem))] top-0 hidden h-screen w-px bg-linear-to-b from-[var(--page-accent)] to-transparent opacity-80 lg:block"
      />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-32 pt-28 sm:px-6 lg:px-8">
        <div className="relative flex-1 lg:min-h-[1100px]">
          <div className="lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--page-muted)]">
              Editorial interface
            </p>
            <h1 className="max-w-4xl text-[clamp(3.4rem,9vw,6.25rem)] leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--page-ink)]">
              Adaptive
              <br />
              layouts with
              <br />
              soft edges
            </h1>
          </div>

          <article className="relative mt-14 w-full border border-[var(--page-border)] bg-[color:color-mix(in_srgb,var(--page-surface)_88%,white)] p-5 shadow-[0_24px_80px_rgba(16,23,20,0.12)] backdrop-blur-sm sm:p-8 lg:ml-auto lg:mt-72 lg:max-w-[38rem] lg:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[var(--page-accent-strong)] to-transparent opacity-70" />
            <div className="space-y-10">
              <section className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--page-muted)]">
                  Introduction
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--page-ink)] sm:text-3xl">
                  {data.headline}
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-[var(--page-muted)] sm:text-base">
                  {data.body}
                </p>
              </section>

              <div className="space-y-8">
                {data.notes.map((note) => (
                  <section
                    key={note.title}
                    className="border-t border-[var(--page-border)] pt-6 first:border-t-0 first:pt-0"
                  >
                    <h3 className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--page-ink)]">
                      {note.title}
                    </h3>
                    <p className="text-[15px] leading-7 text-[var(--page-muted)]">
                      {note.body}
                    </p>
                  </section>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--page-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-sm leading-6 text-[var(--page-muted)]">
                  The desktop layout keeps environmental fades and guide lines. On smaller screens,
                  the shell collapses into a single-column reading surface with tighter spacing.
                </p>
                <Link
                  to="/about"
                  className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--page-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--page-ink)] transition duration-150 ease-out hover:-translate-y-0.5 hover:border-[var(--page-accent-strong)] hover:bg-white active:scale-95"
                >
                  About this build
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

const getData = async () => {
  const data = {
    title: 'IMI',
    headline: 'A calmer way to present interface thinking.',
    body:
      'This homepage now borrows the same reading rhythm as the Interfaces reference: a large anchored heading, a floating document-like content panel, and edge fades that make the viewport feel less abruptly cropped.',
    notes: [
      {
        title: 'Responsive rhythm',
        body:
          'Instead of shrinking everything evenly, the layout changes roles across breakpoints. Desktop keeps the dramatic title locked near the top while the content card offsets to the right. Mobile drops the fixed framing and focuses on a comfortable single-column read.',
      },
      {
        title: 'VerticalFade',
        body:
          'The fade treatment is recreated with fixed layers, Tailwind gradient utilities, backdrop blur, and mask-image values. That keeps the implementation lightweight while preserving the softened top and bottom boundaries from the reference.',
      },
      {
        title: 'Tailwind-first build',
        body:
          'Most of the styling now lives in utility classes, with only a tiny shared token layer in global CSS. This keeps the effect easy to adjust without introducing a separate component stylesheet.',
      },
    ] satisfies Note[],
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
