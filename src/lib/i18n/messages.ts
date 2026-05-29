export { getMessages, messages } from '@/lib/i18n/messages/index'
/**
 * Re-export from the split messages module.
 * This file exists for backward compatibility with existing imports.
 * New code should import from '@/lib/i18n/messages/index' or '@/lib/i18n/messages'.
 */
export type {
	CapabilityCopy,
	CapabilityItemCopy,
	CategoryCopy,
	CodeBlockCopy,
	FooterWandererCopy,
	FooterWandererWithCountry,
	Messages,
	PostTranslatedNoticeCopy,
} from '@/lib/i18n/messages/types'
