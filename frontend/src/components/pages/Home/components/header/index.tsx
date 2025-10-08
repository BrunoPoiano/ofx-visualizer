import { useState } from 'react'
import { toast } from 'sonner'
import { EyeClosedSvg } from '@/components/icons/eyeClosedSvg'
import { EyeSvg } from '@/components/icons/eyeSvg'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { tryCatch } from '@/lib/tryCatch'
import { postOfxFile } from '../../functions'
import { useHomeContext } from '../../provider'
import FilesList from './components/FilesList'
import { InputFiles } from './components/InputFiles'

export const AppHeader = ({
	setTabKey
}: {
	setTabKey: React.Dispatch<React.SetStateAction<number>>
}) => {
	const batchLength = 5
	const [loading, setLoading] = useState(false)
	const [files, setFiles] = useState<Array<File>>([])

	const {
		showValue: [showValue, setShowValue],
		getSourcesFunc
	} = useHomeContext()

	const importFiles = async () => {
		if (!files) return

		setLoading(true)
		let filesRemaining = [...files]
		let bLength = batchLength

		while (bLength > 0 && filesRemaining.length > 0) {
			const notProcessed: Array<File> = []
			const iterations = Math.ceil(filesRemaining.length / bLength)

			for (let i = 0; i < iterations; i++) {
				const formData = new FormData()

				const start = i * bLength
				const end = start + bLength
				const batch = filesRemaining.slice(start, end)

				for (const file of batch) {
					formData.append('file', file)
				}

				console.log('Sending batch', i + 1, 'of', iterations)

				const [, error] = await tryCatch(postOfxFile(formData))

				if (error) {
					console.error('Batch failed:', error)
					notProcessed.push(...batch)
					continue
				}

				setFiles((prev) => prev.filter((f) => !batch.includes(f)))
			}

			if (notProcessed.length === 0) {
				break
			}

			filesRemaining = notProcessed
			bLength--
		}

		if (files.length > 0) {
			toast.error('Not All files were processed.', {
				style: { background: 'var(--destructive)' }
			})
		} else {
			toast.success('Files processed sucessifully!.', {
				style: { background: 'var(--chart-2)' }
			})
		}

		getSourcesFunc()
		setTabKey((prev) => prev + 1)
		setLoading(false)
	}

	return (
		<section className='grid w-full gap-2.5'>
			<div className='flex w-full justify-end gap-2.5'>
				<InputFiles loading={loading} filesState={[files, setFiles]} />
				<Button
					variant='outline'
					disabled={files.length === 0 || loading}
					onClick={importFiles}
				>
					Send
				</Button>
				<Button variant='outline' onClick={() => setShowValue(!showValue)}>
					{showValue ? <EyeSvg /> : <EyeClosedSvg />}
				</Button>
				<ModeToggle />
			</div>
			<FilesList filesState={[files, setFiles]} />
		</section>
	)
}
