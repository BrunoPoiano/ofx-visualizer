import { isDirty } from '@/lib/isDirty'
import { useMemo } from 'react'

type Props<T> = React.HTMLAttributes<string> &
	React.PropsWithChildren & { base: T; newValue: T }

export default function FilterAlert<T extends object>({
	children,
	className,
	base,
	newValue
}: Props<T>) {
	const isAlert = useMemo(() => {
		return isDirty(base, newValue)
			? `border-[1px]
          border-[var(--chart-1)]
          rounded-md
          `
			: `border-[1px]
          border-[transparent]
          `
	}, [base, newValue])

	return (
		<div
			className={`
				${className}
				${isAlert}
    `}
		>
			{children}
		</div>
	)
}
