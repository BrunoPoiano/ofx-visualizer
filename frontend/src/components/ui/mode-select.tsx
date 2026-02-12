import { themes, useTheme } from '../theme/theme-provider'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './select'

export function ModeSelect() {
	const { setTheme, theme } = useTheme()

	return (
		<Select
			defaultValue={theme}
			onValueChange={(item) => setTheme(item as (typeof themes)[number])}
		>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent position={'item-aligned'}>
				<SelectGroup>
					{themes.map((item) => (
						<SelectItem key={item} value={item}>
							{item}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
