'use client'

import { glitchTuning, triggerGlitch } from '@/components/HeroPortrait'
import TunerPanel, { type TunerAction, type TunerControl } from '@/components/TunerPanel'

const controls: readonly TunerControl[] = [
	{ key: 'auto', label: 'auto repeat (0 / 1)', min: 0, max: 1, step: 1 },
	{ key: 'gapMin', label: 'gap min', min: 0, max: 10, step: 0.1, unit: 's' },
	{ key: 'gapMax', label: 'gap max', min: 0, max: 15, step: 0.1, unit: 's' },
	{ key: 'steps', label: 'frames per burst', min: 1, max: 16, step: 1 },
	{ key: 'speed', label: 'speed', min: 0.25, max: 4, step: 0.05, unit: '×' },
	{ key: 'split', label: 'color split', min: 0, max: 60, step: 1, unit: 'px' },
	{ key: 'intensity', label: 'layer intensity', min: 0, max: 1, step: 0.05 },
	{ key: 'bandShift', label: 'band shift', min: 0, max: 120, step: 1, unit: 'px' },
	{ key: 'bandHeight', label: 'band height', min: 2, max: 50, step: 1, unit: '%' },
	{ key: 'jitter', label: 'image jitter', min: 0, max: 30, step: 0.5, unit: 'px' },
	{ key: 'skew', label: 'image skew', min: 0, max: 12, step: 0.25, unit: '°' },
	{ key: 'stutter', label: 'stutter chance', min: 0, max: 1, step: 0.05 }
]

const actions: readonly TunerAction[] = [{ label: '▶ trigger glitch', onClick: triggerGlitch }]

// Sliders for the portrait glitch (scene one). Values go straight into
// HeroPortrait's live `glitchTuning`, read at the start of each burst; copy them
// into its defaults when done. Docked bottom-right: the ring tuner owns the left.
export default function GlitchTuner({ visible }: { visible: boolean }) {
	return (
		<TunerPanel
			title='glitch tuner'
			target={glitchTuning}
			controls={controls}
			actions={actions}
			side='right'
			visible={visible}
		/>
	)
}
