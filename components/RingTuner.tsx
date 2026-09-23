'use client'

import { ringTuning } from '@/components/SkillsRing'
import TunerPanel, { type TunerColor, type TunerControl } from '@/components/TunerPanel'

const controls: readonly TunerControl[] = [
	{ key: 'tilt', label: 'TILT_ANGLE (X)', min: 0, max: 90, step: 1, unit: '°', angle: true },
	{ key: 'yaw', label: 'yaw (Y, offset)', min: -180, max: 180, step: 1, unit: '°', angle: true },
	{ key: 'roll', label: 'roll (Z)', min: -45, max: 45, step: 1, unit: '°', angle: true },
	{ key: 'speed', label: 'ROTATION_SPEED', min: -1, max: 1, step: 0.01 },
	{ key: 'size', label: 'size (scale)', min: 0.4, max: 2, step: 0.05, unit: '×' },
	{ key: 'fontSize', label: 'font size', min: 8, max: 32, step: 0.5, unit: 'px' },
	{ key: 'fontWeight', label: 'font weight', min: 100, max: 800, step: 100 },
	{ key: 'glow', label: 'glow', min: 0, max: 1.4, step: 0.05 },
	{ key: 'moveX', label: 'move X (→)', min: -400, max: 400, step: 1 },
	{ key: 'moveY', label: 'move Y (↑)', min: -400, max: 400, step: 1 }
]

const colors: readonly TunerColor[] = [
	{ key: 'color', label: 'font color' },
	{ key: 'glowColor', label: 'glow color' }
]

// Sliders for the skills ring (scene one). Values go straight into
// SkillsRing's live `ringTuning`; copy them into its constants when done.
export default function RingTuner({ visible }: { visible: boolean }) {
	return (
		<TunerPanel
			title='ring tuner'
			target={ringTuning}
			controls={controls}
			colors={colors}
			visible={visible}
		/>
	)
}
