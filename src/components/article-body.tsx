import type { ComponentType } from 'react'

import { cn } from '../lib/cn'

interface ArticleBodyProps {
	className?: string
	components?: Record<string, ComponentType<any>>
	MDX: ComponentType<any>
}

export function ArticleBody({ className, components, MDX }: ArticleBodyProps) {
	return (
		<div
			className={cn(`
				space-y-6 text-[15px]/7 text-(--color-foreground)
				[&_a]:text-(--color-foreground) [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4
				[&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:bg-surface [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-muted-foreground
				[&_code]:rounded-sm [&_code]:bg-accent [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:break-all
				[&_details]:rounded-lg [&_details]:border [&_details]:bg-surface [&_details]:px-4 [&_details]:py-3
				[&_details_summary]:cursor-pointer [&_details_summary]:font-medium
				[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight
				[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold
				[&_hr]:border-border
				[&_img]:rounded-lg [&_img]:border [&_img]:shadow-(--shadow-soft)
				[&_li]:text-muted-foreground
				[&_li]:marker:text-muted-foreground
				[&_ol]:space-y-2 [&_ol]:pl-5
				[&_p]:text-muted-foreground
				[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:bg-[#16171d] [&_pre]:p-4 [&_pre]:text-[13px]/6 [&_pre]:text-white
				[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
				[&_strong]:font-semibold [&_strong]:text-(--color-foreground)
				[&_table]:w-full [&_table]:border-collapse
				[&_td]:border [&_td]:px-3 [&_td]:py-2
				[&_th]:border [&_th]:bg-surface [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
				[&_ul]:space-y-2 [&_ul]:pl-5
			`, className)}
		>
			<MDX components={components} />
		</div>
	)
}
