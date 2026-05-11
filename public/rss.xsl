<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<title><xsl:value-of select="/rss/channel/title"/></title>
				<style>
					:root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
					body { margin: 0; background: #f7f3ed; color: #171411; }
					main { width: min(720px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0 80px; }
					a { color: inherit; text-decoration-color: color-mix(in srgb, currentColor 24%, transparent); text-underline-offset: 4px; }
					header { margin-bottom: 48px; }
					h1 { margin: 0; font-size: clamp(32px, 6vw, 56px); letter-spacing: 0; line-height: 1; }
					p { color: #625b53; line-height: 1.65; }
					article { padding: 24px 0; border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent); }
					h2 { margin: 0 0 8px; font-size: 20px; }
					time { color: #8b8176; font-size: 14px; }
					@media (prefers-color-scheme: dark) {
						body { background: #11100f; color: #f6f1eb; }
						p { color: #b9afa4; }
						time { color: #8f857a; }
					}
				</style>
			</head>
			<body>
				<main>
					<header>
						<h1><xsl:value-of select="/rss/channel/title"/></h1>
						<p><xsl:value-of select="/rss/channel/description"/></p>
						<p>
							<a href="/feed.xml">中文 RSS</a>
							<xsl:text> · </xsl:text>
							<a href="/feed.en.xml">English RSS</a>
							<xsl:text> · </xsl:text>
							<a href="/feed.ja.xml">日本語 RSS</a>
						</p>
					</header>
					<xsl:for-each select="/rss/channel/item">
						<article>
							<h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
							<time><xsl:value-of select="pubDate"/></time>
							<p><xsl:value-of select="description"/></p>
						</article>
					</xsl:for-each>
				</main>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
