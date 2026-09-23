'use client'

import { useState } from 'react'
import { ringTuning } from '@/components/SkillsRing'

const RAD = Math.PI / 180

const controls = [
	{ key: 'tilt', label: 'TILT_ANGLE (X)', min: 0, max: 90, step: 1, unit: '°' },
	{ key: 'yaw', label: 'yaw (Y, offset)', min: -180, max: 180, step: 1, unit: '°' },
	{ key: 'roll', label: 'roll (Z)', min: -45, max: 45, step: 1, unit: '°' },
	{ key: 'speed', label: 'ROTATION_SPEED', min: -1, max: 1, step: 0.01, unit: '' },
	{ key: 'size', label: 'size (scale)', min: 0.4, max: 2, step: 0.05, unit: '×' },
	{ key: 'fontSize', label: 'font size', min: 8, max: 32, step: 0.5, unit: 'px' },
	{ key: 'fontWeight', label: 'font weight', min: 100, max: 800, step: 100, unit: '' },
	{ key: 'moveX', label: 'move X (→)', min: -400, max: 400, step: 1, unit: '' },
	{ key: 'moveY', label: 'move Y (↑)', min: -400, max: 400, step: 1, unit: '' }
] as const

type Key = (typeof controls)[number]['key']

const isAngle = (key: Key) => key === 'tilt' || key === 'yaw' || key === 'roll'

// Dev-only sliders for finding the ring's look by eye. Values are written
// straight into SkillsRing's live `ringTuning` (read every frame), so nothing
// re-renders the scene; copy the numbers shown into SkillsRing's constants
// when done.
export default function RingTuner() {
	const [, force] = useState(0)
	if (process.env.NODE_ENV !== 'development') return null

	const read = (key: Key) =>
		isAngle(key) ? ringTuning[key] / RAD : ringTuning[key]

	return (
		<div
			style={{
				position: 'fixed',
				left: 16,
				bottom: 16,
				zIndex: 10000,
				width: 240,
				padding: 12,
				background: 'rgba(11,12,14,0.92)',
				border: '1px solid #3d4147',
				font: '11px var(--font-mono), monospace',
				color: '#ecece7'
			}}
		>
			<div style={{ marginBottom: 8, color: '#4fd1c5' }}>ring tuner (dev only)</div>
			{controls.map(c => (
				<label key={c.key} style={{ display: 'block', marginBottom: 8 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>{c.label}</span>
						<span>
							{Number(read(c.key).toFixed(2))}
							{c.unit}
						</span>
					</div>
					<input
						type='range'
						min={c.min}
						max={c.max}
						step={c.step}
						value={read(c.key)}
						style={{ width: '100%' }}
						onChange={e => {
							const v = Number(e.target.value)
							ringTuning[c.key] = isAngle(c.key) ? v * RAD : v
							force(n => n + 1)
						}}
					/>
				</label>
			))}
		</div>
	)
}
