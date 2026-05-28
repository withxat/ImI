/// <reference types="astro/client" />
/// <reference types="unplugin-icons/types/astro" />

import type { Locale } from '@/lib/i18n/constants'

declare global {
	namespace App {
		interface Locals {
			locale: Locale
			visitorGeo: {
				countryCode: null | string
			}
		}
	}
}

export {}
