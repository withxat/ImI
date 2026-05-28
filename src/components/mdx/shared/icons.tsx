import {
	BracesIcon,
	FileCode2Icon,
	FileType2Icon,
	FolderIcon,
} from 'lucide-react'

export function getIconForLanguageExtension(language: string) {
	switch (language) {
		case 'json':
			return <BracesIcon strokeWidth={2} />
		case 'css':
			return <FileCode2Icon strokeWidth={2} />
		case 'js':
		case 'jsx':
		case 'ts':
		case 'tsx':
		case 'typescript':
			return <FileType2Icon strokeWidth={2} />
		default:
			return <FolderIcon strokeWidth={2} />
	}
}
