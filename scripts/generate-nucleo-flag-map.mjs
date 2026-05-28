import fs from 'node:fs'

const iconsDir = 'node_modules/nucleo-flags/dist/types/components'
const iconFiles = fs.readdirSync(iconsDir)
	.filter(f => f.startsWith('Icon') && f.endsWith('.d.ts') && f !== 'Icon.d.ts')
	.map(f => f.replace(/^Icon/, '').replace(/\.d\.ts$/, ''))

function normalize(s) {
	return s.toLowerCase().replace(/[^a-z]/g, '')
}

const byNorm = new Map()
for (const name of iconFiles)
	byNorm.set(normalize(name), `Icon${name}`)

/** Territories / aliases not matched by Intl labels alone. */
const manual = {
	AN: 'IconCuracao',
	AS: 'IconSamoa',
	AX: 'IconAalandIslands',
	BL: 'IconFrance',
	BQ: 'IconNetherlands',
	BV: 'IconNorway',
	CC: 'IconAustralia',
	CD: 'IconDemocraticRepublicCongo',
	CG: 'IconRepublicCongo',
	CP: 'IconFrance',
	CW: 'IconCuracao',
	FK: 'IconFalklandIslands',
	GB: 'IconUnitedKingdom',
	GS: 'IconSouthGeorgiaSandwichIslands',
	HK: 'IconHongKong',
	HM: 'IconAustralia',
	IO: 'IconUnitedKingdom',
	KN: 'IconSaintKittsNevis',
	LC: 'IconSaintLucia',
	MF: 'IconSintMaarten',
	MO: 'IconMacau',
	PM: 'IconFrance',
	PN: 'IconUnitedKingdom',
	PS: 'IconPalestine',
	SH: 'IconUnitedKingdom',
	SJ: 'IconNorway',
	ST: 'IconSaoTomePrincipe',
	TC: 'IconTurksAndCaicosIslands',
	TL: 'IconEastTimor',
	UM: 'IconUnitedStates',
	VC: 'IconSaintVincentGrenadines',
	VG: 'IconBritishVirginIslands',
	VI: 'IconUnitedStatesVirginIslands',
	XK: 'IconKosovo',
}

const dn = new Intl.DisplayNames(['en'], { type: 'region' })
const map = { ...manual }

for (let i = 65; i <= 90; i++) {
	for (let j = 65; j <= 90; j++) {
		const code = String.fromCharCode(i) + String.fromCharCode(j)
		if (map[code])
			continue
		const label = dn.of(code)
		if (!label || label === code)
			continue
		let icon = byNorm.get(normalize(label))
		if (!icon)
			icon = byNorm.get(normalize(label.replace(/^the /i, '')))
		if (!icon && label.includes(','))
			icon = byNorm.get(normalize(label.split(',')[0]))
		if (!icon && label.includes('('))
			icon = byNorm.get(normalize(label.split('(')[0]))
		if (icon)
			map[code] = icon
	}
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)))
const out = `// Generated mapping from nucleo-flags icon names to ISO 3166-1 alpha-2.\n// Regenerate with: node scripts/generate-nucleo-flag-map.mjs\n\nexport const nucleoFlagByIso = ${JSON.stringify(sorted, null, '\t')} as const\n\nexport type NucleoFlagIso = keyof typeof nucleoFlagByIso\n`

fs.writeFileSync('src/lib/nucleo-flag-map.ts', out)
console.log(`Wrote ${Object.keys(sorted).length} ISO entries to src/lib/nucleo-flag-map.ts`)
