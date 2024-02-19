import { CursorChatProps, CursorMode } from '@/types/type';
import React, { ChangeEvent, KeyboardEvent } from 'react';
import CursorSVG from '../../../public/assets/CursorSVG';

export const CursorChat = ({
	cursor,
	cursorState,
	setCursorState,
	updateMyPresence,
}: CursorChatProps) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		updateMyPresence({
			message: event.target.value,
		});

		setCursorState({
			mode: CursorMode.Chat,
			previousMessage: null,
			message: event.target.value,
		});
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setCursorState({
				mode: CursorMode.Chat,
				// @ts-ignore
				previousMessage: cursorState.message,
				message: '',
			});
		} else if (event.key === 'Escape') {
			setCursorState({
				mode: CursorMode.Hidden,
			});
		}
	};

	return (
		<div
			className="absolute top-0 left-0"
			style={{
				transform: `translate(${cursor.x}px, ${cursor.y}px)`,
			}}
		>
			{cursorState.mode === CursorMode.Chat && (
				<>
					<CursorSVG color={'#000'} />

					<div className="absolute top-5 left-2 px-4 py-2 bg-blue-500 leading-relaxed text-white rounded-[20px]">
						{cursorState.previousMessage && (
							<div className="text-xs text-gray-300">
								{/*{cursorState.previousMessage}*/}
							</div>
						)}
						<input
							autoFocus
							type="text"
							className="z-10 w-60 border-none outline-none bg-transparent text-white placeholder-blue-300"
							placeholder={
								cursorState.previousMessage ? '' : 'Type a message...'
							}
							value={cursorState.message}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</>
			)}
		</div>
	);
};
