import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'

import { tryCatch } from '@/lib/tryCatch'
import { toast } from 'sonner'
import {
	deleteTags,
	getTags,
	postTags
} from '@/components/pages/Home/functions'
import type { TagType, TypeAndSetState } from '@/components/pages/Home/types'
import type { PaginationType } from '@/types'

export type DialogTagState = {
	getData: () => Promise<void>
	tags: Array<TagType>
	deleteItem: (id: number) => Promise<void>
	createItem: (name: string) => Promise<void>
	paginationState: TypeAndSetState<PaginationType>
	openState: TypeAndSetState<boolean>
}

const DialogTagContext = createContext<DialogTagState>({} as DialogTagState)

export function DialogTagProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false)
	const [tags, setTags] = useState<Array<TagType>>([])
	const [pagination, setPagination] = useState<PaginationType>({
		per_page: 5,
		total_items: 0,
		last_page: 1,
		current_page: 1
	})

	const getData = useCallback(async () => {
		const [data, error] = await tryCatch(
			getTags({
				current_page: pagination.current_page.toString(),
				per_page: pagination.per_page.toString()
			})
		)

		if (error) {
			toast.error('Error getting Tags list.', {
				style: { background: 'var(--destructive)' }
			})
			return
		}

		setTags(data.data)
		setPagination(data.paginationContent)
	}, [pagination.current_page, pagination.per_page])

	const createItem = async (name: string) => {
		const [_, error] = await tryCatch(postTags(name))

		if (error) {
			toast.error('Error getting Tags list.', {
				style: { background: 'var(--destructive)' }
			})
		} else {
			toast.success('Tag deleted!', {
				style: { background: 'var(--chart-2)' }
			})
			getData()
		}
	}

	const deleteItem = async (id: number) => {
		const [_, error] = await tryCatch(deleteTags(id))

		if (error) {
			toast.error('Error getting Tags list.', {
				style: { background: 'var(--destructive)' }
			})
		} else {
			toast.success('Tag deleted!', {
				style: { background: 'var(--chart-2)' }
			})
			getData()
		}
	}

	useEffect(() => {
		if (open) {
			getData()
		}
	}, [open, getData, pagination.current_page, pagination.per_page])

	return (
		<DialogTagContext.Provider
			value={{
				tags,
				deleteItem,
				createItem,
				getData,
				paginationState: [pagination, setPagination],
				openState: [open, setOpen]
			}}
		>
			{children}
		</DialogTagContext.Provider>
	)
}

export const useDialogTagContext = () => {
	const context = useContext(DialogTagContext)

	if (context === undefined)
		throw new Error(
			'useDialogTagContext must be used within a DialogTagContext'
		)

	return context
}
