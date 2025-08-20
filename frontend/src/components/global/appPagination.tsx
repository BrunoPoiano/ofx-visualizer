import { generateKey } from '@/lib/utils';
import type { PaginationType } from '@/types';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

export const AppPagination = ({
	pagination,
	setPagination,
}: {
	pagination: PaginationType;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}) => {
	const { current_page, last_page, per_page, total_items } = pagination;
	const start = current_page - 3 < 0 ? 0 : current_page - 3;
	const end = current_page + 2 > last_page ? last_page : current_page + 2;

	const changePage = (value: number) => {
		setPagination((prev) => {
			return {
				...prev,
				current_page: value,
			};
		});
	};

	const changePerPage = (value: string) => {
		setPagination((prev) => {
			return {
				...prev,
				current_page: 1,
				per_page: Number.parseInt(value),
			};
		});
	};

	if (total_items === 0) {
		return;
	}

	return (
		<div className="grid place-items-end gap-3.5">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							aria-disabled={current_page === 1}
							tabIndex={current_page === 1 ? -1 : undefined}
							className={
								current_page === 1
									? 'pointer-events-none opacity-50'
									: 'cursor-pointer'
							}
							onClick={() => changePage(current_page - 1)}
						/>
					</PaginationItem>
					{Array.from({ length: end - start }, (_, i) => (
						<PaginationItem key={generateKey(i)}>
							<PaginationLink
								href="#"
								isActive={i + 1 + start === current_page}
								onClick={() => changePage(i + 1 + start)}
							>
								{i + 1 + start}
							</PaginationLink>
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext
							aria-disabled={current_page === last_page}
							tabIndex={current_page === last_page ? -1 : undefined}
							className={
								current_page === last_page
									? 'pointer-events-none opacity-50'
									: 'cursor-pointer'
							}
							onClick={() => changePage(current_page + 1)}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<Select
				value={per_page.toString()}
				onValueChange={(e) => changePerPage(e)}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="5">5</SelectItem>
					<SelectItem value="10">10</SelectItem>
					<SelectItem value="25">25</SelectItem>
					<SelectItem value="50">50</SelectItem>
					<SelectItem value="100">100</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
