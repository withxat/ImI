import type { ComponentType } from 'react'

import { cn } from '@/lib/cn'

interface ArticleBodyProps {
	className?: string
	components?: Record<string, ComponentType<any>>
	mdx: ComponentType<{ components?: Record<string, ComponentType<any>> }>
}

export function ArticleBody({ className, components, mdx: MDXContent }: ArticleBodyProps) {
	return (
		<div
			className={cn(`
				max-w-full min-w-0 space-y-7 text-base/7 wrap-anywhere text-foreground
				[&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4
				[&_blockquote]:my-8 [&_blockquote]:max-w-full [&_blockquote]:min-w-0 [&_blockquote]:pl-5 [&_blockquote]:text-muted-foreground
				[&_code]:rounded-sm [&_code]:bg-accent [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:break-all
				[&_details]:border-y [&_details]:py-3
				[&_details_summary]:cursor-pointer [&_details_summary]:font-medium
				[&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-medium
				[&_h3]:mt-10 [&_h3]:text-xl [&_h3]:font-medium
				[&_hr]:border-border
				[&_img]:my-8 [&_img]:w-full
				[&_li]:text-muted-foreground
				[&_li]:marker:text-muted-foreground
				[&_ol]:space-y-2 [&_ol]:pl-5
				[&_p]:text-muted-foreground
				[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:bg-[#16171d] [&_pre]:p-4 [&_pre]:font-ui [&_pre]:text-[13px]/6 [&_pre]:wrap-normal [&_pre]:text-white
				[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:break-normal [&_pre_code]:wrap-normal [&_pre_code]:text-inherit
				[&_strong]:font-semibold [&_strong]:text-foreground
				[&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto
				[&_td]:border [&_td]:px-3 [&_td]:py-2
				[&_th]:border [&_th]:bg-surface [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
				[&_ul]:space-y-2 [&_ul]:pl-5
			`, className)}
		>
			<MDXContent components={components} />
		</div>
	)
}
