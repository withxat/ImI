import { Link } from 'waku';
import { BottomFade } from '../components/fades';

export default async function HomePage() {
  const data = await getData();

  return (
    <section className="relative">
      <title>{data.title}</title>
      <div className="mx-auto grid min-h-[calc(100vh-121px)] w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm text-[var(--page-muted)]">Responsive layout</p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--page-ink)] sm:text-5xl lg:text-6xl">
            {data.headline}
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--page-muted)]">
            {data.body}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)]">
            <div className="space-y-6 p-5 pb-20 sm:p-6 sm:pb-20">
              {data.sections.map((section) => (
                <div
                  key={section.title}
                  className="space-y-2 border-b border-[var(--page-border)] pb-6 last:border-b-0 last:pb-0"
                >
                  <h2 className="text-lg font-medium text-[var(--page-ink)]">{section.title}</h2>
                  <p className="text-sm leading-6 text-[var(--page-muted)]">{section.body}</p>
                </div>
              ))}
            </div>
            <BottomFade />
          </div>

          <Link
            to="/about"
            className="inline-flex items-center text-sm font-medium text-[var(--page-ink)] underline underline-offset-4"
          >
            About page
          </Link>
        </div>
      </div>
    </section>
  );
}

const getData = async () => {
  return {
    title: 'IMI',
    headline: 'A simple page with responsive structure.',
    body:
      'The layout now stays straightforward: stacked on small screens, two columns on large screens, with only a bottom blur fade added to the content panel.',
    sections: [
      {
        title: 'Mobile',
        body: 'Content stacks into a single column with tighter spacing and no decorative framing.',
      },
      {
        title: 'Desktop',
        body: 'The page switches to a two-column layout so the intro and content block can sit side by side.',
      },
      {
        title: 'Bottom fade',
        body: 'The fade is implemented as a small fixed-looking overlay inside the card using Tailwind gradients, blur, and mask-image.',
      },
    ],
  };
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
