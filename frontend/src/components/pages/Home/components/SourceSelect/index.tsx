import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useHomeContext } from '../../provider'

export const SourceSelect = () => {
	const {
		sources,
		defaultFilter: [defaultFilter, setDefaultFilter],
	} = useHomeContext()

	return (
		<Select
			value={defaultFilter.source_id}
			onValueChange={(e) =>
				setDefaultFilter((prev) => ({ ...prev, source_id: e }))
			}
		>
			<SelectTrigger style={{ width: 'min(250px, 100%)' }}>
				<SelectValue placeholder='Source' />
			</SelectTrigger>
			<SelectContent>
				{sources.map((item) => (
					<SelectItem key={item.id} value={item.id.toString()}>
						{item.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
