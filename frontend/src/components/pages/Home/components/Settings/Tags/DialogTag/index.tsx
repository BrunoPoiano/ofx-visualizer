import { Button } from '@/components/ui/button'
import { DialogTagProvider, useDialogTagContext } from './provider'
import { NewTag } from './components/newTag'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { lazy } from 'react'
const Table = lazy(() => import('./components/table'))

const DialogBody = () => {
	const { openState } = useDialogTagContext()
	const [open, setOpen] = openState

	return (
		<Dialog open={open}>
			<DialogTrigger asChild>
				<Button variant='outline' onClick={() => setOpen(true)}>
					Tags
				</Button>
			</DialogTrigger>
			<DialogContent
				className='sm:max-w-md'
				showCloseButton={false}
				onInteractOutside={() => setOpen(false)}
			>
				<DialogHeader>
					<DialogTitle>Tags</DialogTitle>
					<DialogDescription>
						Create Tags to mark expecific transactions
					</DialogDescription>
				</DialogHeader>
				<NewTag />
				<Table />
			</DialogContent>
		</Dialog>
	)
}

export default function DialogTag() {
	return (
		<DialogTagProvider>
			<DialogBody />
		</DialogTagProvider>
	)
}
