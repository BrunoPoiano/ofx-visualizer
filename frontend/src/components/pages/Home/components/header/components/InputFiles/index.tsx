import { type Dispatch, type SetStateAction, useId } from 'react';
import { Input } from '@/components/ui/input';

export const InputFiles = ({
	filesState,
	loading,
}: {
	filesState: [Array<File>, Dispatch<SetStateAction<Array<File>>>];
	loading: boolean;
}) => {
	const [files, setFiles] = filesState;
	const inputId = useId();

	const checkFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files === null) {
			return;
		}

		setFiles(() => {
			const ofxFiles: File[] = [];
			for (const item of Array.from(files)) {
				if (item.name.includes('.ofx')) {
					ofxFiles.push(item);
				}
			}
			return ofxFiles;
		});
	};
	return (
		<label
			htmlFor={inputId}
			className=' m-0 block w-full min-w-0 flex-auto cursor-pointer content-center rounded border border-secondary-500 border-solid bg-transparent bg-clip-padding px-3 py-[0.32rem] font-normal text-base text-surface transition duration-300 ease-in-out'
		>
			<Input
				multiple
				type='file'
				id={inputId}
				className='hidden'
				accept='.ofx'
				placeholder='Upload File'
				loading={loading}
				disabled={loading}
				onChange={checkFiles}
			/>
			<span>
				{files.length === 0
					? 'Choose OFX files'
					: `${files.length} file${files.length > 1 ? 's' : ''} ${loading ? ' remaining' : 'selected'}`}
			</span>
		</label>
	);
};
