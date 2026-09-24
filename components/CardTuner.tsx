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
	{ key: 'turns', label: 'entrance turns', min: 0, max: 4, step: 0.25 },
	{ key: 'plateMix', label: 'plate: flat vs ribbons', min: 0, max: 1, step: 0.02 },
	{ key: 'plateCount', label: 'plate: ribbon count', min: 2, max: 14, step: 1 },
	{ key: 'plateWidthPx', label: 'plate: ribbon width', min: 4, max: 60, step: 1 },
	{ key: 'plateNoiseScale', label: 'plate: bend scale', min: 0.3, max: 5, step: 0.05 },
	{ key: 'plateSway', label: 'plate: bend strength', min: 0, max: 2.5, step: 0.05 },
	{ key: 'plateForwardBias', label: 'plate: straightness', min: 0.2, max: 2, step: 0.02 },
	{ key: 'plateSpeed', label: 'plate: flow speed', min: 0, max: 0.4, step: 0.01 },
	{ key: 'plateBrightness', label: 'plate: brightness', min: 0.2, max: 2.5, step: 0.05 },
	{ key: 'plateDotScale', label: 'plate: dot density', min: 20, max: 220, step: 2 },
	{ key: 'plateDotSize', label: 'plate: dot size', min: 0.02, max: 0.45, step: 0.01 },
	{ key: 'plateDotDarken', label: 'plate: dot darken', min: 0, max: 0.6, step: 0.01 },
	// 1 = hold: the flow freezes at "plate: scrub" below instead of auto-advancing.
	// Click the slider then use the arrow keys to step it one frame at a time, like
	// dragging the playhead in Unity's Animation window.
	{ key: 'plateTimeHold', label: 'plate: hold (1 = paused)', min: 0, max: 1, step: 1 },
	{ key: 'plateTimeScrub', label: 'plate: scrub (while held)', min: 0, max: 120, step: 1 / 60 }
]

const colors: readonly TunerColor[] = [
	{ key: 'tint', label: 'card tint' },
	{ key: 'lightColor', label: 'top light color' },
	{ key: 'plateColorA', label: 'plate color A (start)' },
	{ key: 'plateColorB', label: 'plate color B' },
	{ key: 'plateColorC', label: 'plate color C' },
	{ key: 'plateColorD', label: 'plate color D (end)' }
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
