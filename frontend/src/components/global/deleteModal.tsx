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
import { Trash } from 'lucide-react'

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
					variant='destructive'
					onClick={() => setOpen(true)}
					disabled={!value || buttonDisabled}
				>
					{buttonLabel || <Trash />}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove item?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					<span>This action cannot be undone</span>
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
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
