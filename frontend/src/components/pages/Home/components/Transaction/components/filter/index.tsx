import { TransactionTypeValues } from '@/components/pages/Home/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { SourceSelect } from '../../../SourceSelect'
import { useTransactionContext } from '../../provider'

export default function Filter() {
	const {
		filter: [filter, setFilter],
		clearFilter
	} = useTransactionContext()

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
		<>
			<Input
				placeholder='Search'
				value={filter.search}
				name='search'
				onChange={changeFilter}
			/>
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
				<Select
					value={filter.type}
					onValueChange={(e) => setFilter((prev) => ({ ...prev, type: e }))}
				>
					<SelectTrigger style={{ width: 'min(250px, 100%)' }}>
						<SelectValue placeholder='Type' />
					</SelectTrigger>
					<SelectContent>
						{TransactionTypeValues.map((el) => (
							<SelectItem key={el} value={el}>
								{el}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<SourceSelect />
				<Button className='ml-auto' variant='ghost' onClick={clearFilter}>
					Clear filter
				</Button>
			</div>
		</>
	)
}
