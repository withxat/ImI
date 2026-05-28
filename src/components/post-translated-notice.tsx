'use client'

import type { PostTranslatedNoticeCopy } from '@/lib/i18n/messages'
import type { Translator } from '@/types/translator'

import { PostTranslatorTitle } from '@/components/post-translator-title'
import { persistLocale } from '@/lib/i18n/persist-locale'

const ZH_LINK_LABEL = '中文'

export function PostTranslatedNoticeAside({
	notice,
	translator,
}: {
	notice: PostTranslatedNoticeCopy
	translator?: Translator
}) {
	return (
		<aside
			className="surface-callout px-4 py-3 font-ui text-sm/relaxed text-muted-foreground"
			role="note"
		>
			{translator ? <PostTranslatorTitle translator={translator} /> : null}
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
