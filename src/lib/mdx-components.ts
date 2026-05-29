import AccordionItem from '@/components/mdx/accordion-item.astro'
import AccordionPanel from '@/components/mdx/accordion-panel.astro'
import AccordionTrigger from '@/components/mdx/accordion-trigger.astro'
import Accordion from '@/components/mdx/accordion.astro'
import MdxA from '@/components/mdx/mdx-a.astro'
import MdxBlockquote from '@/components/mdx/mdx-blockquote.astro'
import MdxCode from '@/components/mdx/mdx-code.astro'
import MdxH1 from '@/components/mdx/mdx-h1.astro'
import MdxH2 from '@/components/mdx/mdx-h2.astro'
import MdxH3 from '@/components/mdx/mdx-h3.astro'
import MdxH4 from '@/components/mdx/mdx-h4.astro'
import MdxH5 from '@/components/mdx/mdx-h5.astro'
import MdxH6 from '@/components/mdx/mdx-h6.astro'
import MdxHr from '@/components/mdx/mdx-hr.astro'
import MdxImg from '@/components/mdx/mdx-img.astro'
import MdxLi from '@/components/mdx/mdx-li.astro'
import MdxOl from '@/components/mdx/mdx-ol.astro'
import MdxP from '@/components/mdx/mdx-p.astro'
import MdxStrong from '@/components/mdx/mdx-strong.astro'
import MdxTable from '@/components/mdx/mdx-table.astro'
import MdxTd from '@/components/mdx/mdx-td.astro'
import MdxTh from '@/components/mdx/mdx-th.astro'
import MdxTr from '@/components/mdx/mdx-tr.astro'
import MdxUl from '@/components/mdx/mdx-ul.astro'

/** Standard MDX component map for rendering blog posts and portfolio content. */
export const mdxComponents = {
	a: MdxA,
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
	blockquote: MdxBlockquote,
	code: MdxCode,
	h1: MdxH1,
	h2: MdxH2,
	h3: MdxH3,
	h4: MdxH4,
	h5: MdxH5,
	h6: MdxH6,
	hr: MdxHr,
	img: MdxImg,
	li: MdxLi,
	ol: MdxOl,
	p: MdxP,
	strong: MdxStrong,
	table: MdxTable,
	td: MdxTd,
	th: MdxTh,
	tr: MdxTr,
	ul: MdxUl,
}
