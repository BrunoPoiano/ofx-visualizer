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
			<small className='h-[27px] pb-2.5 text-start'>No items selected</small>
		)
	}

	return (
		<div className='flex h-[27px] gap-2.5 overflow-auto'>
			<button
				className='cursor-pointer pb-2.5'
				type='button'
				onClick={() => setFiles([])}
			>
				Clean
			</button>
			<div className='flex w-full gap-2.5 overflow-auto pb-2.5'>
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
		</div>
	)
}
