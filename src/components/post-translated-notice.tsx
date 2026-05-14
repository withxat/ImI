'use client'

import type { PostTranslatedNoticeCopy } from '@/lib/i18n/messages'

import { persistLocale } from '@/lib/i18n/persist-locale'

const ZH_LINK_LABEL = '中文'

export function PostTranslatedNoticeAside({ notice }: { notice: PostTranslatedNoticeCopy }) {
	return (
		<aside
			className="surface-callout px-4 py-3 font-ui text-sm/relaxed text-muted-foreground"
			role="note"
		>
			{notice.beforeLink}
			<button
				onClick={() => {
					persistLocale('zh')
					window.location.reload()
				}}
				aria-label={notice.switchToChineseAriaLabel}
				className="text-link cursor-pointer border-none bg-transparent p-0 font-[inherit]"
				lang="zh"
				type="button"
			>
				{ZH_LINK_LABEL}
			</button>
			{notice.afterLink}
		</aside>
	)
}
