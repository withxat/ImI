import { ConstructionStripesIcon } from '@/components/construction-stripes-icon'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/cn'

export function CapabilityEmptyPlaceholder({
	description,
	title,
}: {
	description: string
	title: string
}) {
	return (
		<div
			className={cn(
				buttonVariants({ variant: 'outline' }),
				`
					pointer-events-none h-auto min-h-0 w-full cursor-default items-center justify-start gap-3 rounded-xl px-4
					py-3.5 text-left font-normal whitespace-normal shadow-none
					before:rounded-xl before:shadow-none
				`,
			)}
			role="status"
		>
			<span className="min-w-0 flex-1 space-y-1">
				<span className="block text-sm font-medium text-foreground">{title}</span>
				<span className="block truncate text-sm text-muted-foreground">{description}</span>
			</span>
			<ConstructionStripesIcon className="-mx-0.5 text-muted-foreground opacity-80" />
		</div>
	)
}
