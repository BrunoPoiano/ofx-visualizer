import type { ReactNode } from 'react';

export const AppEllipsis = ({
	children,
	width,
}: {
	children: ReactNode;
	width?: string;
}) => {
	return (
		<p
			className='overflow-clip text-ellipsis'
			style={{ maxWidth: width ? width : '100%' }}
		>
			{children}
		</p>
	);
};
