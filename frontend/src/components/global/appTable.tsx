import React from 'react';
import { generateKey } from '@/lib/utils';
import type { PaginationType } from '@/types';
import { ArrowSVG } from '../icons/arrowUp';
import type { OrderBy } from '../pages/Home/types';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import { AppEllipsis } from './appEllipsis';
import { AppPagination } from './appPagination';

type TableContent = {
	label: string;
	id: OrderBy['order'];
};

type AppTableProps<T extends { [key: string]: string | React.ReactNode }, F> = {
	small?: boolean | undefined;
	tableContentSmall?: F[];
	tableContent: F[];
	orderBy: [OrderBy, React.Dispatch<React.SetStateAction<OrderBy>>];
	showValue: boolean;
	pagination: [
		PaginationType,
		React.Dispatch<React.SetStateAction<PaginationType>>,
	];
	tableData: T[];
};

export const AppTable = <
	T extends { [key: string]: string | React.ReactNode },
	F extends TableContent,
>({
	small = false,
	tableContentSmall,
	tableContent,
	orderBy: [orderBy, setOrderBy],
	pagination: [pagination, setPagination],
	showValue,
	tableData,
}: AppTableProps<T, F>) => {
	const changeOrderBy = (order: F['id']) => {
		let direction = orderBy.direction;

		if (orderBy.order === order) {
			direction = direction === 'ASC' ? 'DESC' : 'ASC';
		} else {
			direction = 'ASC';
		}

		setOrderBy(() => ({ direction, order }));
	};

	return (
		<div className='grid min-h-[430px] gap-3.5'>
			<div className='rounded-md border' style={{ maxWidth: '1280px' }}>
				<ScrollArea className={`${small ? 'h-82' : 'h-150'} w-full`}>
					<Table>
						<TableHeader className='sticky top-0 bg-background'>
							<TableRow>
								{(small && tableContentSmall
									? tableContentSmall
									: tableContent
								).map((item) => (
									<TableHead key={item.id}>
										{React.isValidElement(tableData[0]?.[item.id]) ? (
											<p className='w-full text-center'>{item.label}</p>
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
							{tableData.length === 0 && (
								<TableRow>
									<TableCell colSpan={4} className='text-center'>
										No content found.
									</TableCell>
								</TableRow>
							)}
							{tableData.map((item) => (
								<TableRow key={generateKey()}>
									{(small && tableContentSmall
										? tableContentSmall
										: tableContent
									).map((info) => (
										<TableCell
											key={info.id}
											className={
												info.id === 'desc' ? 'text-left' : 'text-center'
											}
											style={
												info.id === 'desc'
													? { maxWidth: '30ch' }
													: { width: '10ch' }
											}
										>
											{showValue ? (
												<AppEllipsis>{(item as T)[info.id]}</AppEllipsis>
											) : (
												'****'
											)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
			<AppPagination pagination={pagination} setPagination={setPagination} />
		</div>
	);
};
