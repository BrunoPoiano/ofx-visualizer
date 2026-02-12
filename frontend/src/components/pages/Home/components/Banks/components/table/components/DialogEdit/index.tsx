import { useState } from 'react'
import { toast } from 'sonner'
import { useHomeContext } from '@/components/pages/Home/provider'
import type { BankType } from '@/components/pages/Home/types'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBankContext } from '../../../../provider'
import { PenIcon } from 'lucide-react'
import { putBanks } from '../../../../functions'

export default function DialogEdit({ item }: { item: BankType }) {
	const {
		getSourcesFunc,
		showValue: [value]
	} = useHomeContext()
	const { getBanksFunc } = useBankContext()

	const [name, setName] = useState(item.name)
	const [open, setOpen] = useState(false)

	const saveName = async () => {
		await putBanks(item.id, { name })
			.then(() => {
				setOpen(false)
				getBanksFunc()
				getSourcesFunc()

				toast.error('Name successifully saved!', {
					style: { background: 'var(--chart-2)' }
				})
			})
			.catch((e) => {
				console.error(e)

				toast.error(e.request.response || 'Error saving Bank name.', {
					style: { background: 'var(--destructive)' }
				})
			})
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger asChild>
				<Button
					variant='outline'
					onClick={() => setOpen(true)}
					disabled={!value}
				>
					<PenIcon />
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
					<Button variant='success' onClick={() => saveName()}>
						Save
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
