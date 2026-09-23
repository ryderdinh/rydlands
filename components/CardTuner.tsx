'use client'

import { cardTuning } from '@/components/CardScene'
import TunerPanel, { type TunerColor, type TunerControl } from '@/components/TunerPanel'

const controls: readonly TunerControl[] = [
	{ key: 'exposure', label: 'exposure', min: 0.2, max: 3, step: 0.05 },
	{ key: 'envIntensity', label: 'environment light', min: 0, max: 3, step: 0.05 },
	{ key: 'glint', label: 'pointer light', min: 0, max: 30, step: 0.5 },
	{ key: 'normal', label: 'relief strength', min: 0, max: 3, step: 0.05 },
	{ key: 'roughness', label: 'roughness ×', min: 0, max: 3, step: 0.05 },
	{ key: 'clearcoat', label: 'clearcoat', min: 0.02, max: 1, step: 0.02 },
	{ key: 'tilt', label: 'tilt amount', min: 0, max: 2.5, step: 0.05, unit: '×' },
	{ key: 'size', label: 'size (scale)', min: 0.5, max: 1.5, step: 0.02, unit: '×' }
]

const colors: readonly TunerColor[] = [
	{ key: 'tint', label: 'card tint' },
	{ key: 'glintColor', label: 'pointer light color' }
]

// Sliders for the metal card (scene two). Values go straight into
// CardScene's live `cardTuning`; copy them into its constants when done.
export default function CardTuner({ visible }: { visible: boolean }) {
	return (
		<TunerPanel
			title='card tuner'
			target={cardTuning}
			controls={controls}
			colors={colors}
			visible={visible}
		/>
	)
}
