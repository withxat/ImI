import type { Translator, TranslatorBrand } from '@/types/translator'

import claudeLogo from '@/assets/claude.svg'
import geminiLogo from '@/assets/gemini.svg'
import openAiLogo from '@/assets/openai.svg'
import qwenLogo from '@/assets/qwen.svg'
import { cn } from '@/lib/cn'

const TRANSLATOR_META: Record<TranslatorBrand, { label: string, logo: string, logoClassName?: string }> = {
	claude: {
		label: 'Claude',
		logo: claudeLogo,
	},
	gemini: {
		label: 'Gemini',
		logo: geminiLogo,
	},
	openai: {
		label: 'OpenAI',
		logo: openAiLogo,
		logoClassName: 'dark:invert',
	},
	qwen: {
		label: 'Qwen',
		logo: qwenLogo,
	},
}

export function PostTranslatorTitle({ translator }: { translator: Translator }) {
	const [brand, model] = translator
	const meta = TRANSLATOR_META[brand]

	return (
		<div className="mb-2.5 flex items-center gap-2 font-ui text-sm font-medium text-foreground">
			<span className="flex size-5 items-center justify-center rounded-full bg-background text-foreground shadow-xs ring-1 ring-border/80">
				<img alt={meta.label} className={cn('size-3.5', meta.logoClassName)} src={meta.logo} />
			</span>
			<span>{model}</span>
		</div>
	)
}
