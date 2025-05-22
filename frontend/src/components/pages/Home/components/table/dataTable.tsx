import { AppEllipsis } from "@/components/global/appEllipsis";
import { ArrowSVG } from "@/components/icons/arrowUp";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { parseDate } from "@/lib/utils";
import { useHomeContext } from "@/Pages/Home/provider";
import { TableInfo, TableInfoSmall } from "./table";
import type { TransactionType } from "@/Pages/Home/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TransactionTable = ({ small = false }: { small?: boolean }) => {
	const {
		transactions: [transactions],
		showValue: [showValue],
		filter: [filter, setFilter],
	} = useHomeContext();

	const changeOrderBy = (order: string) => {
		let direction = filter.direction;
		if (filter.order === order) {
			direction = direction === "ASC" ? "DESC" : "ASC";
		} else {
			direction = "ASC";
		}
		console.log(filter.order, order, filter.order === order, direction);

		setFilter((prev) => ({ ...prev, order, direction }));
	};

	return (
		<div className="rounded-md border" style={{ maxWidth: "1280px" }}>
			<ScrollArea className="h-96 w-full">
				<Table>
					<TableHeader className="sticky top-0">
						<TableRow>
							{(small ? TableInfoSmall : TableInfo).map((item) => (
								<TableHead key={item.id}>
									<Button
										variant="ghost"
										className="t-al w-full"
										onClick={() => changeOrderBy(item.id)}
									>
										{item.label}{" "}
										<ArrowSVG
											direction={
												filter.order === item.id && filter.direction === "ASC"
													? "up"
													: "down"
											}
										/>
									</Button>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.length === 0 && (
							<TableRow>
								<TableCell colSpan={4} className="text-center">
									No transactions found.
								</TableCell>
							</TableRow>
						)}
						{transactions.map((item) => (
							<TableRow key={item.id}>
								{(small ? TableInfoSmall : TableInfo).map((info) => (
									<TableCell
										key={info.id}
										className="text-left"
										style={
											info.id === "desc"
												? { maxWidth: "30ch" }
												: { width: "10ch" }
										}
									>
										{showValue ? (
											info.id === "date" ? (
												parseDate(item.date)
											) : (
												<AppEllipsis>
													{info.id === "value" ? "R$ " : ""}
													{(item as TransactionType)[info.id]}
												</AppEllipsis>
											)
										) : (
											"****"
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</div>
	);
};
