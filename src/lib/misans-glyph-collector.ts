import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

interface MisansGlyphCollectorPlugin {
	buildStart: () => Promise<void>
	configureServer: () => Promise<void>
	enforce: 'pre'
	handleHotUpdate: (context: { file: string }) => Promise<void>
	name: 'misans-glyph-collector'
}

const GLYPH_DIR = '.cache/misans-glyphs'
const UI_GLYPHS_FILE = `${GLYPH_DIR}/ui.txt`
const CONTENT_GLYPHS_FILE = `${GLYPH_DIR}/content.txt`

const UI_SOURCE_FILES = [
	'src/lib/i18n/code-block-copy.ts',
	'src/lib/i18n/intro-badges.ts',
	'src/lib/i18n/messages/en.ts',
	'src/lib/i18n/messages/ja.ts',
	'src/lib/i18n/messages/zh.ts',
]

const CONTENT_CONFIG_FILES = [
	'content/config.json',
]

const POSTS_DIR = 'content/posts'

const STATIC_PUNCTUATION = '，。！？、；：「」『』（）《》—…·￥“”‘’～ー・'
const GLYPH_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}\p{Script=Common}\p{Script=Inherited}]/u
const VARIATION_SELECTOR_RE = /^[\uFE00-\uFE0F]$/
const EMOJI_MODIFIER_RE = /^[\u{1F3FB}-\u{1F3FF}]$/u
const EMOJI_RE = /^\p{Extended_Pictographic}$/u

export const MISANS_GLYPH_SCAN_FILES = {
	content: [CONTENT_GLYPHS_FILE],
	default: [UI_GLYPHS_FILE],
} satisfies Record<string, string[]>

async function pathExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath)
		return true
	}
	catch {
		return false
	}
}

async function listFiles(dir: string, extensions: ReadonlySet<string>): Promise<string[]> {
	if (!await pathExists(dir))
		return []

	const entries = await fs.readdir(dir, { withFileTypes: true })
	const nested = await Promise.all(entries.map(async (entry) => {
		const entryPath = path.join(dir, entry.name)
		if (entry.isDirectory())
			return listFiles(entryPath, extensions)
		if (entry.isFile() && extensions.has(path.extname(entry.name)))
			return [entryPath]
		return []
	}))

	return nested.flat()
}

async function readExistingFiles(files: readonly string[]): Promise<string[]> {
	const existing = await Promise.all(files.map(async file => (
		await pathExists(file) ? fs.readFile(file, 'utf8') : ''
	)))
	return existing
}

function stripTsComments(source: string): string {
	return source
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function splitMdxFrontmatter(source: string): { body: string, frontmatter: string } {
	if (!source.startsWith('---'))
		return { body: source, frontmatter: '' }

	const end = source.indexOf('\n---', 3)
	if (end === -1)
		return { body: source, frontmatter: '' }

	const frontmatterEnd = source.indexOf('\n', end + 4)
	return {
		body: frontmatterEnd === -1 ? '' : source.slice(frontmatterEnd + 1),
		frontmatter: source.slice(3, end),
	}
}

function markdownVisibleText(source: string): string {
	return source
		.replace(/```[\s\S]*?```/g, '')
		.replace(/~~~[\s\S]*?~~~/g, '')
		.replace(/`[^`\n]*`/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
		.replace(/^\s*(?:import|export)\s.+$/gm, '')
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/<[^>]+>/g, '')
}

function shouldKeepGlyph(char: string): boolean {
	if (char.codePointAt(0)! <= 0x7F)
		return false
	if (VARIATION_SELECTOR_RE.test(char))
		return false
	if (EMOJI_MODIFIER_RE.test(char))
		return false
	if (EMOJI_RE.test(char))
		return false
	return GLYPH_RE.test(char)
}

function collectGlyphs(sources: readonly string[]): string {
	const glyphs = new Set<string>()

	for (const char of STATIC_PUNCTUATION)
		glyphs.add(char)

	for (const source of sources) {
		for (const char of source) {
			if (shouldKeepGlyph(char))
				glyphs.add(char)
		}
	}

	return [...glyphs].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join('')
}

async function collectPostSources(): Promise<{ body: string[], frontmatter: string[] }> {
	const postFiles = await listFiles(POSTS_DIR, new Set(['.md', '.mdx']))
	const posts = await readExistingFiles(postFiles)
	const body: string[] = []
	const frontmatter: string[] = []

	for (const post of posts) {
		const parts = splitMdxFrontmatter(post)
		frontmatter.push(parts.frontmatter)
		body.push(markdownVisibleText(parts.body))
	}

	return { body, frontmatter }
}

async function writeGlyphFile(filePath: string, content: string): Promise<void> {
	await fs.mkdir(path.dirname(filePath), { recursive: true })

	if (await pathExists(filePath)) {
		const current = await fs.readFile(filePath, 'utf8')
		if (current === content)
			return
	}

	await fs.writeFile(filePath, content)
}

async function generateMisansGlyphs(): Promise<void> {
	const [uiSources, configSources, posts] = await Promise.all([
		readExistingFiles(UI_SOURCE_FILES),
		readExistingFiles(CONTENT_CONFIG_FILES),
		collectPostSources(),
	])

	const uiGlyphs = collectGlyphs([
		...uiSources.map(stripTsComments),
		...configSources,
		...posts.frontmatter,
	])
	const contentGlyphs = collectGlyphs([
		...configSources,
		...posts.frontmatter,
		...posts.body,
	])

	await Promise.all([
		writeGlyphFile(UI_GLYPHS_FILE, uiGlyphs),
		writeGlyphFile(CONTENT_GLYPHS_FILE, contentGlyphs),
	])
}

function shouldRegenerate(file: string): boolean {
	const relative = path.relative(process.cwd(), file)
	return (
		UI_SOURCE_FILES.includes(relative)
		|| CONTENT_CONFIG_FILES.includes(relative)
		|| relative.startsWith(`${POSTS_DIR}/`)
	)
}

export default function misansGlyphCollector(): MisansGlyphCollectorPlugin {
	return {
		async buildStart() {
			await generateMisansGlyphs()
		},
		async configureServer() {
			await generateMisansGlyphs()
		},
		enforce: 'pre',
		async handleHotUpdate(context) {
			if (shouldRegenerate(context.file))
				await generateMisansGlyphs()
		},
		name: 'misans-glyph-collector',
	}
}
