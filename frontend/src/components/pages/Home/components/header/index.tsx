import { useState } from 'react';
import { toast } from 'sonner';
import { EyeClosedSvg } from '@/components/icons/eyeClosedSvg';
import { EyeSvg } from '@/components/icons/eyeSvg';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { tryCatch } from '@/lib/tryCatch';
import { postOfxFile } from '../../functions';
import { useHomeContext } from '../../provider';
import FilesList from './components/FilesList';
import { InputFiles } from './components/InputFiles';

export const AppHeader = ({
	setTabKey,
}: {
	setTabKey: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const batchLength = 5;
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<Array<File>>([]);

	const {
		showValue: [showValue, setShowValue],
		getSourcesFunc,
	} = useHomeContext();

	const sendFiles = async (formData: FormData) => {
		const [, error] = await tryCatch(postOfxFile(formData));

		if (error) {
			console.error(error);
			toast.error('Error processing files.', {
				style: { background: 'var(--destructive)' },
			});
		} else {
			toast.success('Files processed sucessifully!.', {
				style: { background: 'var(--chart-2)' },
			});
		}
	};

	const importFiles = async () => {
		if (!files) return;
		setLoading(true);

		const iterations = Math.ceil(files.length / batchLength);
		for (let i = 0; i < iterations; i++) {
			const start = i * batchLength;
			const end = start + batchLength;
			const batch = files.slice(start, end);
			const formData = new FormData();

			for (const file of batch) {
				formData.append('file', file);
			}

			console.log('Sending batch', i + 1, 'of', iterations);

			setFiles((prev) => prev.slice(batchLength));
			await sendFiles(formData);
		}

		setLoading(false);
		getSourcesFunc();
		setTabKey((prev) => prev + 1);
	};

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
	);
};
