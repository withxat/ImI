import { CopyButton } from '@/components/mdx/shared/copy-button'
import { getIconForLanguageExtension } from '@/components/mdx/shared/icons'
import { ScrollArea } from '@/components/mdx/ui/scroll-area'

export function CodeBlock({
	code,
	copyButton = true,
	language,
	title,
}: {
	code: string
	copyButton?: boolean
	language: string
	showLineNumbers?: boolean
	title?: string
}) {
	return (
		<figure data-rehype-pretty-code-figure="">
			{title && (
				<figcaption
					className="
						flex items-center gap-2 text-[.8125rem] text-code-foreground
						[&_svg]:size-4.5 [&_svg]:text-code-foreground
						sm:[&_svg]:size-4
					"
					data-language={language}
					data-rehype-pretty-code-title=""
				>
					{getIconForLanguageExtension(language)}
					{title}
				</figcaption>
			)}
			{copyButton && <CopyButton value={code} />}
			<ScrollArea className="
				**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2
				**:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2
			"
			>
				<pre>
					<code data-language={language}>{code}</code>
				</pre>
			</ScrollArea>
		</figure>
	)
}
