import { useId, useState } from 'react';
import { toast } from 'sonner';
import { EyeClosedSvg } from '@/components/icons/eyeClosedSvg';
import { EyeSvg } from '@/components/icons/eyeSvg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { postOfxFile } from '../../functions';
import { useHomeContext } from '../../provider';

export const AppHeader = ({
	setTabKey,
}: {
	setTabKey: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const formData = new FormData();
	const [loading, setLoading] = useState(false);

	const {
		showValue: [showValue, setShowValue],
		getSourcesFunc,
	} = useHomeContext();

	const inportFIle = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoading(true);
		const files = e.target.files;
		if (!files?.length) return;

		for (let i = 0; i <= files.length - 1; i++) {
			formData.append('file', files[i]);
		}

		await postOfxFile(formData)
			.then(() => {
				getSourcesFunc();
				setTabKey((prev) => prev + 1);
				toast.success('File successifully parsed!.', {
					style: { background: 'var(--chart-2)' },
				});
			})
			.catch((e) => {
				console.error(e);
				toast.error(e.request.response || 'Error updating file.', {
					style: { background: 'var(--destructive)' },
				});
			})
			.finally(() => {
				e.target.value = '';
				setLoading(false);
			});
	};

	return (
		<div className='flex w-full justify-end gap-2.5'>
			<Input
				multiple
				type='file'
				id={useId()}
				className='file:-mx-3 file:-my-[0.32rem] m-0 block w-full min-w-0 flex-auto cursor-pointer content-center rounded border border-secondary-500 border-solid bg-transparent bg-clip-padding px-3 py-[0.32rem] font-normal text-base text-surface transition duration-300 ease-in-out file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-inherit file:border-e file:border-solid file:bg-transparent file:px-3 file:py-[0.32rem] file:text-surface'
				accept='.ofx'
				placeholder='Upload File'
				loading={loading}
				onChange={inportFIle}
			/>
			<Button variant='outline' onClick={() => setShowValue(!showValue)}>
				{showValue ? <EyeSvg /> : <EyeClosedSvg />}
			</Button>
			<ModeToggle />
		</div>
	);
};
