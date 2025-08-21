import { Input } from '@/components/ui/input';
import { useBankContext } from '../../provider';

export const Filter = () => {
	const {
		filter: [filter, setFilter],
	} = useBankContext();

	const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter((prev) => {
			if (e.target.type === 'number') {
				return {
					...prev,
					[e.target.name]: e.target.value ? Number(e.target.value) : undefined,
				};
			}

			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	return (
		<Input
			placeholder='Search'
			value={filter.search}
			name='search'
			onChange={changeFilter}
		/>
	);
};
