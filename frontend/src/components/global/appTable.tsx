import React from 'react'
import { generateKey } from '@/lib/utils'
import type { PaginationType } from '@/types'
import { ArrowSVG } from '../icons/arrowUp'
import type { OrderBy, TableInfoType } from '../pages/Home/types'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '../ui/table'
import { AppEllipsis } from './appEllipsis'
import { AppPagination } from './appPagination'

type AppTableProps<T extends { [key: string]: string | React.ReactNode }> = {
	small?: boolean | undefined
	tableContentSmall?: TableInfoType<OrderBy['order']>[]
	tableContent: TableInfoType<OrderBy['order']>[]
	orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>]
	showValue: boolean
	pagination: [
		PaginationType,
		React.Dispatch<React.SetStateAction<PaginationType>>
	]
	tableData: T[]
}

export const AppTable = <
	T extends { [key: string]: string | React.ReactNode }
>({
	small = false,
	tableContentSmall,
	tableContent,
	orderBy: [orderBy, setOrderBy],
	pagination: [pagination, setPagination],
	showValue,
	tableData
}: AppTableProps<T>) => {
	const tableValues =
		small && tableContentSmall ? tableContentSmall : tableContent

	const changeOrderBy = (order: OrderBy['order'] | 'options') => {
		if (order === 'options') return
		let direction = orderBy.direction

		if (orderBy.order === order) {
			direction = direction === 'ASC' ? 'DESC' : 'ASC'
		} else {
			direction = 'ASC'
		}

		setOrderBy(() => ({ direction, order: order as OrderBy['order'] }))
	}

	return (
		<div className='grid min-h-[430px] gap-3.5'>
			<div className='rounded-md border' style={{ maxWidth: '1280px' }}>
				<ScrollArea className={`${small ? 'h-82' : 'h-150'} w-full`}>
					<Table>
						<TableHeader className='sticky top-0 bg-background'>
							<TableRow>
								{tableValues.map((item) => (
									<TableHead
										key={item.id}
										style={item.style || { width: '10ch' }}
									>
										{!item.order ||
										React.isValidElement(tableData[0]?.[item.id]) ? (
											<span className='block w-full text-center'>
												{item.label}
											</span>
										) : (
											<Button
												variant='ghost'
												className='t-al w-full'
												onClick={() => changeOrderBy(item.id)}
											>
												{item.label}{' '}
												<ArrowSVG
													direction={
														orderBy.order === item.id &&
														orderBy.direction === 'ASC'
															? 'up'
															: 'down'
													}
												/>
											</Button>
										)}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableData.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={tableValues.length}
										className='text-center'
									>
										No content found.
									</TableCell>
								</TableRow>
							) : (
								tableData.map((item) => (
									<TableRow key={generateKey()}>
										{tableValues.map((info) => (
											<TableCell
												key={info.id}
												className={info.class || 'text-center'}
												style={info.style || { width: '10ch' }}
											>
												{React.isValidElement((item as T)[info.id]) ? (
													(item as T)[info.id]
												) : showValue || info.showValue ? (
													<AppEllipsis>{(item as T)[info.id]}</AppEllipsis>
												) : (
													'****'
												)}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
			<AppPagination pagination={pagination} setPagination={setPagination} />
		</div>
	)
}
