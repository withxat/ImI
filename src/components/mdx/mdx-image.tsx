'use client'

import type * as React from 'react'

import { Image } from '@unpic/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

const CLOUDFLARE_IMAGE_DOMAIN = 'assets.xat.sh'
const ARTICLE_IMAGE_WIDTH = 720
const ARTICLE_IMAGE_SIZES = '(min-width: 768px) 624px, calc(100vw - 32px)'

type MdxImageProps = {
	placeholder?: string
} & React.ImgHTMLAttributes<HTMLImageElement>

function toPositiveInteger(value: React.ImgHTMLAttributes<HTMLImageElement>['height']) {
	if (typeof value === 'number')
		return Number.isFinite(value) && value > 0 ? value : undefined
	if (typeof value !== 'string')
		return undefined

	const parsed = Number.parseInt(value, 10)
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function imageMetadataFor(
	src: React.ImgHTMLAttributes<HTMLImageElement>['src'],
	width: React.ImgHTMLAttributes<HTMLImageElement>['width'],
	height: React.ImgHTMLAttributes<HTMLImageElement>['height'],
	placeholder: MdxImageProps['placeholder'],
): undefined | { height: number, placeholder?: string, src: string, width: number } {
	const explicitWidth = toPositiveInteger(width)
	const explicitHeight = toPositiveInteger(height)

	if (typeof src !== 'string')
		return undefined

	if (explicitWidth && explicitHeight) {
		return { height: explicitHeight, placeholder, src, width: explicitWidth }
	}

	return undefined
}

function cloudflareSource(src: string) {
	try {
		const url = new URL(src)
		if (url.hostname !== CLOUDFLARE_IMAGE_DOMAIN)
			return src

		return url.pathname
	}
	catch {
		return src
	}
}

function isCloudflareAssetUrl(src: string) {
	try {
		return new URL(src).hostname === CLOUDFLARE_IMAGE_DOMAIN
	}
	catch {
		return false
	}
}

export function MdxImage({
	alt = '',
	className,
	decoding = 'async',
	height,
	loading = 'lazy',
	onLoad,
	placeholder,
	src,
	style,
	width,
	...props
}: MdxImageProps): React.ReactElement {
	const imgRef = useRef<HTMLImageElement>(null)
	const [loaded, setLoaded] = useState(false)
	const metadata = imageMetadataFor(src, width, height, placeholder)

	useEffect(() => {
		setLoaded(Boolean(imgRef.current?.complete && imgRef.current.naturalWidth))
	}, [src])

	const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
		setLoaded(true)
		onLoad?.(event)
	}

	if (typeof src === 'string' && metadata) {
		const aspectRatio = metadata.width / metadata.height
		const displayWidth = Math.min(ARTICLE_IMAGE_WIDTH, Math.max(metadata.width, 1))
		const displayHeight = Math.round(displayWidth / aspectRatio)

		return (
			<Image
				options={{
					cloudflare: {
						domain: CLOUDFLARE_IMAGE_DOMAIN,
					},
				}}
				alt={alt}
				background={metadata.placeholder}
				cdn={isCloudflareAssetUrl(src) ? 'cloudflare' : undefined}
				className={cn('mdx-image rounded-xl border', className)}
				data-loaded={loaded ? '' : undefined}
				decoding={decoding}
				height={displayHeight}
				layout="constrained"
				loading={loading}
				onLoad={handleLoad}
				ref={imgRef}
				sizes={ARTICLE_IMAGE_SIZES}
				src={cloudflareSource(src)}
				width={displayWidth}
				{...props}
			/>
		)
	}

	return (
		<img
			style={{
				...style,
			}}
			alt={alt}
			className={cn('mdx-image rounded-xl border', className)}
			data-loaded={loaded ? '' : undefined}
			decoding={decoding}
			height={height}
			loading={loading}
			onLoad={handleLoad}
			ref={imgRef}
			src={src}
			width={width}
			{...props}
		/>
	)
}
