'use client'

import { useState } from 'react'

export interface TunerControl {
	key: string
	label: string
	min: number
	max: number
	step: number
	unit?: string
	// Stored in radians, shown and edited in degrees.
	angle?: boolean
}

export interface TunerColor {
	key: string
	label: string
}

const RAD = Math.PI / 180

const panelBox = {
	position: 'fixed',
	left: 16,
	bottom: 16,
	zIndex: 10000,
	background: 'rgba(11,12,14,0.92)',
	border: '1px solid #3d4147',
	font: '11px var(--font-mono), monospace'
} as const

// Dev-only panel for finding a scene's look by eye. Values are written
// straight into `target` (a live object the scene reads every frame), so
// nothing re-renders the scene; copy the numbers shown into the scene's
// constants when done. `visible` hides it without unmounting, so the
// collapsed/expanded state survives a scene change.
export default function TunerPanel({
	title,
	target,
	controls,
	colors = [],
	visible
}: {
	title: string
	target: Record<string, number | string>
	controls: readonly TunerControl[]
	colors?: readonly TunerColor[]
	visible: boolean
}) {
	const [, force] = useState(0)
	const [hidden, setHidden] = useState(false)
	if (process.env.NODE_ENV !== 'development' || !visible) return null

	const read = (c: TunerControl) =>
		c.angle ? (target[c.key] as number) / RAD : (target[c.key] as number)

	if (hidden) {
		return (
			<button
				type='button'
				onClick={() => setHidden(false)}
				style={{
					...panelBox,
					padding: '6px 10px',
					color: '#4fd1c5',
					cursor: 'pointer'
				}}
			>
				show {title}
			</button>
		)
	}

	return (
		<div style={{ ...panelBox, width: 240, padding: 12, color: '#ecece7' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 8,
					color: '#4fd1c5'
				}}
			>
				<span>{title} (dev only)</span>
				<button
					type='button'
					onClick={() => setHidden(true)}
					style={{
						padding: '2px 6px',
						background: 'transparent',
						border: '1px solid #3d4147',
						font: 'inherit',
						color: '#ecece7',
						cursor: 'pointer'
					}}
				>
					hide
				</button>
			</div>
			{controls.map(c => (
				<label key={c.key} style={{ display: 'block', marginBottom: 8 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>{c.label}</span>
						<span>
							{Number(read(c).toFixed(2))}
							{c.unit}
						</span>
					</div>
					<input
						type='range'
						min={c.min}
						max={c.max}
						step={c.step}
						value={read(c)}
						style={{ width: '100%' }}
						onChange={e => {
							const v = Number(e.target.value)
							target[c.key] = c.angle ? v * RAD : v
							force(n => n + 1)
						}}
					/>
				</label>
			))}
			{colors.map(c => (
				<label
					key={c.key}
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 8
					}}
				>
					<span>{c.label}</span>
					<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span>{target[c.key]}</span>
						<input
							type='color'
							value={target[c.key] as string}
							style={{ width: 32, height: 20, padding: 0, border: 0, background: 'none' }}
							onChange={e => {
								target[c.key] = e.target.value
								force(n => n + 1)
							}}
						/>
					</span>
				</label>
			))}
		</div>
	)
}
