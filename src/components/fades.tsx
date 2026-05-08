type FadeProps = {
  side: 'top' | 'bottom' | 'left' | 'right';
  height?: number;
  width?: string;
  blurClassName?: string;
  className?: string;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const VerticalFade = ({
  side,
  height = 120,
  blurClassName = 'backdrop-blur-[2px]',
  className,
}: FadeProps) => {
  const isTop = side === 'top';

  return (
    <div
      aria-hidden
      className={cx(
        'pointer-events-none fixed inset-x-0 z-20 hidden md:block',
        blurClassName,
        isTop
          ? 'top-0 bg-linear-to-t from-transparent to-[var(--page-bg)] [mask-image:linear-gradient(to_bottom,var(--page-bg)_25%,transparent)]'
          : 'bottom-0 bg-linear-to-b from-transparent to-[var(--page-bg)] [mask-image:linear-gradient(to_top,var(--page-bg)_25%,transparent)]',
        className
      )}
      style={{ height }}
    />
  );
};

export const HorizontalFade = ({
  side,
  width = '16vw',
  blurClassName = 'backdrop-blur-md',
  className,
}: FadeProps) => {
  const isLeft = side === 'left';

  return (
    <div
      aria-hidden
      className={cx(
        'pointer-events-none fixed inset-y-0 z-20 hidden min-w-28 lg:block',
        blurClassName,
        isLeft
          ? 'left-0 bg-linear-to-l from-transparent to-[var(--page-bg)] [mask-image:linear-gradient(to_right,var(--page-bg),transparent)]'
          : 'right-0 bg-linear-to-r from-transparent to-[var(--page-bg)] [mask-image:linear-gradient(to_left,var(--page-bg),transparent)]',
        className
      )}
      style={{ width }}
    />
  );
};
