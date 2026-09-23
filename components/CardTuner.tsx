'use client'

import { cardTuning, replayCardEntrance } from '@/components/CardScene'
import TunerPanel, {
	type TunerAction,
	type TunerColor,
	type TunerControl
} from '@/components/TunerPanel'

const controls: readonly TunerControl[] = [
	{ key: 'exposure', label: 'exposure', min: 0.2, max: 3, step: 0.05 },
	{ key: 'envIntensity', label: 'environment light', min: 0, max: 3, step: 0.05 },
	{ key: 'light', label: 'top light', min: 0, max: 5, step: 0.05 },
	{ key: 'normal', label: 'relief strength', min: 0, max: 3, step: 0.05 },
	{ key: 'roughness', label: 'roughness ×', min: 0, max: 3, step: 0.05 },
	{ key: 'clearcoat', label: 'clearcoat', min: 0.02, max: 1, step: 0.02 },
	{ key: 'idle', label: 'idle sway', min: 0, max: 3, step: 0.05, unit: '×' },
	{ key: 'size', label: 'size (scale)', min: 0.5, max: 1.5, step: 0.02, unit: '×' },
	{ key: 'stiffness', label: 'entrance stiffness', min: 10, max: 120, step: 1 },
	{ key: 'damping', label: 'entrance damping', min: 0.2, max: 1.5, step: 0.02 },
	{ key: 'turns', label: 'entrance turns', min: 0, max: 4, step: 0.25 }
]

const colors: readonly TunerColor[] = [
	{ key: 'tint', label: 'card tint' },
	{ key: 'lightColor', label: 'top light color' }
]

const actions: readonly TunerAction[] = [
	{ label: '▶ replay entrance', onClick: replayCardEntrance }
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
			actions={actions}
			visible={visible}
		/>
	)
}
