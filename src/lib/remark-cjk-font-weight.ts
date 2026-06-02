const CJK_TEXT_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303F\uFF00-\uFFEF]/u
const CJK_TEXT_SPLIT_RE = /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303F\uFF00-\uFFEF]+)/gu

type WeightKey = 'medium' | 'regular' | 'semibold'

interface MdastNode {
	attributes?: MdxJsxAttribute[]
	children?: MdastNode[]
	name?: string
	type: string
	value?: string
}

interface MdxJsxAttribute {
	name: string
	type: 'mdxJsxAttribute'
	value: string
}

function weightForNode(node: MdastNode, inherited: WeightKey): WeightKey {
	switch (node.type) {
		case 'heading':
			return 'semibold'
		case 'strong':
		case 'tableCell':
			return 'medium'
		default:
			return inherited
	}
}

function cjkSpan(value: string, weight: WeightKey): MdastNode {
	return {
		attributes: [{
			name: 'data-cjk-font-weight',
			type: 'mdxJsxAttribute',
			value: weight,
		}],
		children: [{ type: 'text', value }],
		name: 'span',
		type: 'mdxJsxTextElement',
	}
}

function splitTextNode(node: MdastNode, weight: WeightKey): MdastNode[] {
	const value = node.value ?? ''
	return value.split(CJK_TEXT_SPLIT_RE).flatMap((part): MdastNode[] => {
		if (!part)
			return []
		if (!CJK_TEXT_RE.test(part))
			return [{ type: 'text', value: part }]
		return [cjkSpan(part, weight)]
	})
}

function visit(node: MdastNode, inheritedWeight: WeightKey) {
	if (!node.children)
		return

	const weight = weightForNode(node, inheritedWeight)
	node.children = node.children.flatMap((child): MdastNode[] => {
		if (child.type === 'text' && child.value && CJK_TEXT_RE.test(child.value))
			return splitTextNode(child, weight)

		visit(child, weight)
		return [child]
	})
}

export default function remarkCjkFontWeight() {
	return (tree: MdastNode) => {
		visit(tree, 'regular')
	}
}
