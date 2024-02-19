import { COLORS } from '@/constants';
import React from 'react';
import CursorSVG from '../../../public/assets/CursorSVG';

type CursorProps = {
	color: (typeof COLORS)[number];
	x: number;
	y: number;
	message: string;
};

export const Cursor = ({ color, y, x, message }: CursorProps) => {
	return (
		<div
			className={'pointer-events-none absolute left-0 top-0'}
			style={{
				transform: `translate(${x}px, ${y}px)`,
			}}
		>
			<CursorSVG color={color} />
			{message && (
				<div
					className="absolute top-5 left-2 rounded-3xl px-4 py-2"
					style={{
						backgroundColor: color,
					}}
				>
					<p className={'text-white whitespace-nowrap leading-relaxed text-sm'}>
						{message}
					</p>
				</div>
			)}
		</div>
	);
};
