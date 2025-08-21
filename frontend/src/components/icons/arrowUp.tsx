type ArrowSVGType = {
	width?: string;
	direction?: 'up' | 'down' | 'left' | 'right';
};

export const ArrowSVG = ({ width = '10', direction = 'up' }: ArrowSVGType) => {
	let dir = '';

	switch (direction) {
		case 'down':
			dir = '180deg';
			break;
		case 'left':
			dir = '270deg';
			break;
		case 'right':
			dir = '90deg';
			break;
		default:
			dir = '0deg';
	}

	return (
		<svg
			style={{ fill: 'var(--foreground)', rotate: dir }}
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
			width={width}
		>
			<title id='closed-eye-title'>Closed Eye Icon</title>
			<g id='SVGRepo_bgCarrier' strokeWidth='0' />
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<g id='SVGRepo_iconCarrier'>
				<path d='M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z' />
			</g>
		</svg>
	);
};
