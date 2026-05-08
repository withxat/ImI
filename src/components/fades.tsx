type BottomFadeProps = {
  height?: number;
  className?: string;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const BottomFade = ({
  height = 112,
  className,
}: BottomFadeProps) => {
  return (
    <div
      aria-hidden
      className={cx(
        'pointer-events-none absolute inset-x-0 bottom-0 z-20 backdrop-blur-[6px]',
        'bg-linear-to-b from-transparent to-[var(--page-surface)]',
        '[mask-image:linear-gradient(to_top,var(--page-surface)_18%,transparent)]',
        className
      )}
      style={{ height }}
    />
  );
};
