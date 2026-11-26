interface HastProperties {
	className?: string
}

interface MdastNode {
	attributes?: MdastAttribute[]
	children?: MdastNode[]
	name?: string
	properties?: HastProperties
	tagName?: string
	type: string
}

interface MdastAttribute {
	name?: string
	type?: string
	value?: unknown
}

function classNamesOf(node: MdastNode): string[] {
	const names: string[] = []
	for (const attribute of node.attributes ?? []) {
		if (attribute.type !== 'mdxJsxAttribute')
			continue
		if (attribute.name !== 'class' && attribute.name !== 'className')
			continue
		if (typeof attribute.value !== 'string')
			continue
		names.push(...attribute.value.split(/\s+/).filter(Boolean))
	}
	return names
}

function element(tagName: string, properties: HastProperties, children: MdastNode[]): MdastNode {
	return {
		children,
		properties,
		tagName,
		type: 'element',
	}
}

/**
 * rehype-fluent-emoji leaves emoji inside hast `samp` alone, but MDX keeps
 * `<samp>` as a JSX node, so the ignore list never sees it. Promote a block
 * `<samp class="emoji-source">` to a real paragraph > samp before that plugin runs.
 */
function promotePlainSamp(node: MdastNode) {
	const children = node.children
	if (!children)
		return

	for (let index = 0; index < children.length; index++) {
		const child = children[index]
		if (!child)
			continue

		const isSamp = (child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') && child.name === 'samp'
		if (isSamp && classNamesOf(child).includes('emoji-source')) {
			const samp = element('samp', { className: 'emoji-source' }, child.children ?? [])
			const next = child.type === 'mdxJsxFlowElement'
				? element('p', {}, [samp])
				: samp
			children[index] = next
			promotePlainSamp(next)
			continue
		}

		promotePlainSamp(child)
	}
}

export default function rehypePlainSamp() {
	return (tree: MdastNode) => {
		promotePlainSamp(tree)
	}
}
