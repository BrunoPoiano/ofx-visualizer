import type { StatementType } from '@/components/pages/Home/types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { generateKey } from '@/lib/utils';

export const DialogInfo = ({ item }: { item: StatementType }) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Info</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Balances</AlertDialogTitle>
					<AlertDialogDescription>
						<div className="grid gap-2.5">
							{item.yields.map((yieldItem) => (
								<Card key={generateKey()}>
									<CardTitle className="px-6">{yieldItem.name}</CardTitle>
									<CardContent>
										<p>{yieldItem.desc}</p>
										<p>
											{yieldItem.value.toLocaleString('pt-BR', {
												style: 'currency',
												currency: 'BRL',
											})}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>OK</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
