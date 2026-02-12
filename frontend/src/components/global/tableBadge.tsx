import type { VariantProps } from 'class-variance-authority'
import { Badge, type badgeVariants } from '../ui/badge'
import { useHomeContext } from '../pages/Home/provider'
type Props = {
	items: string[]
	variant?: VariantProps<typeof badgeVariants>['variant']
	setTag: (tag: string) => void
	selected: string
}

export default function TableBadge({
	items,
	variant,
	setTag,
	selected
}: Props) {
	const {
		showValue: [showValue]
	} = useHomeContext()
	return (
		<div className='flex gap-1'>
			{items.map((item) => (
				<Badge
					className='cursor-pointer'
					variant={selected === item ? 'default' : variant || 'outline'}
					key={item}
					onClick={() => setTag(item)}
				>
					{showValue ? item : '***'}
				</Badge>
			))}
		</div>
	)
}
