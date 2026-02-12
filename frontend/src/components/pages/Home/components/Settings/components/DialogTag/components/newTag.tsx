import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useDialogTagContext } from '../provider'

export const NewTag = () => {
	const { createItem } = useDialogTagContext()

	const [name, setName] = useState('')

	return (
		<div className='flex gap-1 items-center'>
			<Input value={name} onChange={(e) => setName(e.target.value)} />
			<Button
				onClick={() => createItem(name).then(() => setName(''))}
				disabled={name === ''}
				className='bg-[var(--chart-2)]'
			>
				Save
			</Button>
		</div>
	)
}
