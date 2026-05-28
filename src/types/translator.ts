export const TRANSLATOR_BRANDS = ['openai', 'claude', 'gemini', 'qwen'] as const

export type TranslatorBrand = typeof TRANSLATOR_BRANDS[number]
export type Translator = [TranslatorBrand, string]

export function isTranslatorBrand(value: string): value is TranslatorBrand {
	return TRANSLATOR_BRANDS.includes(value as TranslatorBrand)
}

export function toTranslator(value: string[] | undefined): Translator | undefined {
	if (!value || value.length !== 2) {
		return undefined
	}

	const [brand, model] = value
	if (!brand || !model || !isTranslatorBrand(brand)) {
		return undefined
	}

	return [brand, model]
}
