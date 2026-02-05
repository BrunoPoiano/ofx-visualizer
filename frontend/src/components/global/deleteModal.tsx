import { useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useHomeContext } from '../pages/Home/provider'

interface Props {
	onClick: () => void
	buttonLabel?: string
	buttonDisabled?: boolean
}

export default function DeleteModal({
	buttonLabel,
	buttonDisabled,
	onClick
}: Props) {
	const {
		showValue: [value]
	} = useHomeContext()

	const [open, setOpen] = useState(false)
	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger asChild>
				<Button
					className='bg-[var(--destructive)]'
					onClick={() => setOpen(true)}
					disabled={!value || buttonDisabled}
				>
					{buttonLabel || 'Deletar'}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remover item?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					<span>Essa Ação não podera ser desfeita</span>
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className='bg-[var(--destructive)]'
						onClick={() => {
							onClick()
							setOpen(false)
						}}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
