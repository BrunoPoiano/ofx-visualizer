import { useId } from 'react'
import { Items } from './items'

export default function SettingsSection() {
	return (
		<div className='grid gap-5 mt-5'>
			{Items.map((item) => (
				<div
					key={useId()}
					className='flex items-center justify-between gap-2 rounded-md border-[1px] border-[var(--border)] px-10 py-13'
				>
					<span>
						<b>{item.label}</b>
					</span>
					{item.setting}
				</div>
			))}
		</div>
	)
}
