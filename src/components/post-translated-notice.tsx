'use client'

import type { PostTranslatedNoticeCopy } from '@/lib/i18n/messages'

import { useRouter } from 'waku'

import { persistLocale } from '@/lib/i18n/persist-locale'

const ZH_LINK_LABEL = '中文'

export function PostTranslatedNoticeAside({ notice }: { notice: PostTranslatedNoticeCopy }) {
	const router = useRouter()

	return (
		<aside
			className="mb-12 rounded-xl border border-border bg-muted/30 px-4 py-3 font-ui text-sm/relaxed text-muted-foreground"
			role="note"
		>
			{notice.beforeLink}
			<button
				className="
					text-link cursor-pointer border-none bg-transparent p-0 font-[inherit] text-muted-foreground
					hover:text-foreground
				"
				onClick={() => {
					persistLocale('zh')
					void router.reload()
				}}
				aria-label={notice.switchToChineseAriaLabel}
				lang="zh"
				type="button"
			>
				{ZH_LINK_LABEL}
			</button>
			{notice.afterLink}
		</aside>
	)
}
