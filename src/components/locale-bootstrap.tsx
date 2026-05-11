'use client'

import type { Locale } from '@/lib/i18n/constants'

import { useEffect, useRef } from 'react'

import { isLocale, LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY } from '@/lib/i18n/constants'

function writeLocaleCookie(locale: Locale) {
	document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
}

interface LocaleBootstrapProps {
	serverLocale: Locale
}

/** If localStorage disagrees with the server (e.g. cookie cleared), sync cookie and reload once. */
export function LocaleBootstrap({ serverLocale }: LocaleBootstrapProps) {
	const bootstrapRanRef = useRef(false)

	useEffect(() => {
		if (bootstrapRanRef.current) {
			return
		}
		bootstrapRanRef.current = true

		try {
			const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
			if (!stored || !isLocale(stored) || stored === serverLocale) {
				return
			}
			writeLocaleCookie(stored)
			window.location.reload()
		}
		catch {
			// ignore private mode / disabled storage
		}
	}, [serverLocale])

	return null
}
