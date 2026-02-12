import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SourceSelect } from '../../../SourceSelect'
import { filterBase, useStatementContext } from '../../provider'
import FilterAlert from '@/components/global/FilterAlert'

export default function Filter() {
	const {
		filter: [filter, setFilter],
		clearFilter
	} = useStatementContext()

	const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter((prev) => {
			if (e.target.type === 'number') {
				return {
					...prev,
					[e.target.name]: e.target.value ? Number(e.target.value) : undefined
				}
			}

			return { ...prev, [e.target.name]: e.target.value }
		})
	}

	return (
		<div className='flex flex-wrap gap-2.5'>
			<Input
				className='w-[250px]'
				placeholder='Min Value'
				type='number'
				name='minValue'
				value={filter.minValue || ''}
				onChange={changeFilter}
			/>
			<Input
				className='w-[250px]'
				placeholder='Max Value'
				type='number'
				name='maxValue'
				value={filter.maxValue || ''}
				onChange={changeFilter}
			/>

			<SourceSelect />
			<FilterAlert className='ml-auto' base={filterBase} newValue={filter}>
				<Button variant='ghost' onClick={clearFilter}>
					Clear filter
				</Button>
			</FilterAlert>
		</div>
	)
}
