import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DialogTagProvider, useDialogTagContext } from './provider'
import Table from './components/table'
import { NewTag } from './components/newTag'

const Dialog = () => {
	const { openState } = useDialogTagContext()

	const [open, setOpen] = openState
	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger asChild>
				<Button variant='outline' onClick={() => setOpen(true)}>
					Tags
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='w-3xl'>
				<AlertDialogTitle>Tags</AlertDialogTitle>
				<NewTag />
				<Table />
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => setOpen(false)}>
						Close
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default function DialogTag() {
	return (
		<DialogTagProvider>
			<Dialog />
		</DialogTagProvider>
	)
}
