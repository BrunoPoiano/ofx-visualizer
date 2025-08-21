import { useState } from 'react';
import { toast } from 'sonner';
import { putBanks } from '@/components/pages/Home/functions';
import { useHomeContext } from '@/components/pages/Home/provider';
import type { BankType } from '@/components/pages/Home/types';
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
import { Input } from '@/components/ui/input';
import { useBankContext } from '../../../../provider';

export const DialogEdit = ({ item }: { item: BankType }) => {
	const { getBanksFunc } = useHomeContext();
	const { getBanksFunc: getBankFunc2 } = useBankContext();

	const [name, setName] = useState(item.name);
	const [open, setOpen] = useState(false);

	const saveName = async () => {
		await putBanks(item.id, { name })
			.then(() => {
				setOpen(false);
				getBanksFunc();
				getBankFunc2();
				toast.error('Name successifully saved!', {
					style: { background: 'var(--chart-2)' },
				});
			})
			.catch((e) => {
				console.error(e);

				toast.error(e.request.response || 'Error saving Bank name.', {
					style: { background: 'var(--destructive)' },
				});
			});
	};

	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger asChild>
				<Button variant='outline' onClick={() => setOpen(true)}>
					Edit
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Edit {item.name}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					<Input
						placeholder='Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogAction>
					<AlertDialogAction onClick={() => saveName()}>Save</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
