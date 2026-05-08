import { Link } from 'waku'

export function Header() {
	return (
		<header className="border-b border-(--page-border) bg-(--page-bg)">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<h2 className="text-sm font-semibold text-(--page-ink)">
					<Link className="transition-colors duration-150 hover:text-black" to="/">
						IMI
					</Link>
				</h2>
				<p className="hidden text-sm text-(--page-muted) sm:block">
					Simple responsive layout
				</p>
			</div>
		</header>
	)
}
