import type { Dispatch, SetStateAction } from 'react'
import { CloseSvg } from '@/components/icons/closeSvg'
import { Badge } from '@/components/ui/badge'

export default function FilesList({
	filesState
}: {
	filesState: [Array<File>, Dispatch<SetStateAction<Array<File>>>]
}) {
	const [files, setFiles] = filesState

	if (files.length === 0) {
		return (
			<small className='text-start h-[27px] pb-2.5'>No items selected</small>
		)
	}

	return (
		<div className='flex gap-2.5 h-[27px] overflow-auto pb-2.5'>
			{files.map((item, index) => (
				<Badge key={item.name} variant='outline'>
					{item.name}{' '}
					<button
						type='button'
						className='cursor-pointer'
						onClick={() =>
							setFiles((prev) =>
								prev.filter((_, fileIndex) => fileIndex !== index)
							)
						}
					>
						<CloseSvg />
					</button>
				</Badge>
			))}
		</div>
	)
}
