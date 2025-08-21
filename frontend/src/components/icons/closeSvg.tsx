import { useId } from 'react';

export const CloseSvg = () => {
	return (
		<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<title id={useId()}>Close</title>
			<g id={useId()} stroke-width='0' />
			<g id={useId()} stroke-linecap='round' stroke-linejoin='round' />
			<g id={useId()}>
				<g id={useId()}>
					<path
						id={useId()}
						d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
						style={{ stroke: 'var(--foreground)' }}
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
					/>
				</g>
			</g>
		</svg>
	);
};
