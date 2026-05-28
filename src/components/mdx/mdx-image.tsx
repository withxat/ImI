'use client'

import type * as React from 'react'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'
import { IMAGE_DIMENSIONS } from '@/lib/image-metadata'

interface ImageDimension {
	height: number
	width: number
}

function toPositiveInteger(value: React.ImgHTMLAttributes<HTMLImageElement>['height']) {
	if (typeof value === 'number')
		return Number.isFinite(value) && value > 0 ? value : undefined
	if (typeof value !== 'string')
		return undefined

	const parsed = Number.parseInt(value, 10)
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function dimensionsForImage(
	src: React.ImgHTMLAttributes<HTMLImageElement>['src'],
	width: React.ImgHTMLAttributes<HTMLImageElement>['width'],
	height: React.ImgHTMLAttributes<HTMLImageElement>['height'],
): ImageDimension | undefined {
	const explicitWidth = toPositiveInteger(width)
	const explicitHeight = toPositiveInteger(height)
	if (explicitWidth && explicitHeight) {
		return { height: explicitHeight, width: explicitWidth }
	}

	if (typeof src !== 'string')
		return undefined

	return IMAGE_DIMENSIONS[src as keyof typeof IMAGE_DIMENSIONS]
}

export function MdxImage({
	alt = '',
	className,
	decoding = 'async',
	height,
	loading = 'lazy',
	onLoad,
	src,
	style,
	width,
	...props
}: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement {
	const imgRef = useRef<HTMLImageElement>(null)
	const [loaded, setLoaded] = useState(false)
	const dimensions = dimensionsForImage(src, width, height)

	useEffect(() => {
		setLoaded(Boolean(imgRef.current?.complete && imgRef.current.naturalWidth))
	}, [src])

	return (
		<img
			onLoad={(event) => {
				setLoaded(true)
				onLoad?.(event)
			}}
			style={{
				...style,
				...(dimensions ? { aspectRatio: `${dimensions.width} / ${dimensions.height}` } : {}),
			}}
			alt={alt}
			className={cn('mdx-image rounded-xl border', className)}
			data-loaded={loaded ? '' : undefined}
			decoding={decoding}
			height={dimensions?.height ?? height}
			loading={loading}
			ref={imgRef}
			src={src}
			width={dimensions?.width ?? width}
			{...props}
		/>
	)
}
