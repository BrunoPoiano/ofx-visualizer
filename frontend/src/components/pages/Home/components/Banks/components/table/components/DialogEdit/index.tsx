import { useState } from 'react';
import { toast } from 'sonner';
import { putBanks } from '@/components/pages/Home/functions';
import { useHomeContext } from '@/components/pages/Home/provider';
import type { BankType } from '@/components/pages/Home/types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
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
	const { getSourcesFunc } = useHomeContext();
	const { getBanksFunc } = useBankContext();

	const [name, setName] = useState(item.name);
	const [open, setOpen] = useState(false);

	const saveName = async () => {
		await putBanks(item.id, { name })
			.then(() => {
				setOpen(false);
				getBanksFunc();
				getSourcesFunc();

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
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						style={{ background: 'var(--chart-2)' }}
						onClick={() => saveName()}
					>
						Save
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
