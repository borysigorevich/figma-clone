'use client';
import { CursorChat } from '@/components/cursor/CursorChat';
import { LiveCursors } from '@/components/cursor/LiveCursors';
import { CursorMode, CursorState } from '@/types/type';
import React, {
	PointerEvent,
	useCallback,
	useEffect,
	useState,
	KeyboardEvent,
} from 'react';
import { useMyPresence, useOthers } from '../../liveblocks.config';

type PresenceType = {
	cursor: {
		x: number;
		y: number;
	} | null;
	message: string;
};

export const Live = () => {
	const others = useOthers();
	const [myPresence, updateMyPresence] = useMyPresence();

	const [cursorState, setCursorState] = useState<CursorState>({
		mode: CursorMode.Hidden,
	});

	const handlePointerMove = useCallback((event: PointerEvent) => {
		event.preventDefault();
		const { clientX, clientY } = event;

		const x = clientX - event.currentTarget.getBoundingClientRect().x;
		const y = clientY - event.currentTarget.getBoundingClientRect().y;

		updateMyPresence({
			cursor: {
				x,
				y,
			},
		});
	}, []);

	const handlePointerLeave = useCallback((event: PointerEvent) => {
		setCursorState({
			mode: CursorMode.Hidden,
		});
		updateMyPresence({
			cursor: null,
			message: null,
		});
	}, []);

	const handlePointerDown = useCallback((event: PointerEvent) => {
		const { clientX, clientY } = event;
		const x = clientX - event.currentTarget.getBoundingClientRect().x;
		const y = clientY - event.currentTarget.getBoundingClientRect().y;

		updateMyPresence({
			cursor: {
				x,
				y,
			},
		});
	}, []);

	const cursor = (myPresence as PresenceType).cursor;

	useEffect(() => {
		const onKeyUp = (event: globalThis.KeyboardEvent) => {
			if (event.key === '/') {
				setCursorState({
					mode: CursorMode.Chat,
					previousMessage: null,
					message: '',
				});
			} else if (event.key === 'Escape') {
				setCursorState({
					mode: CursorMode.Hidden,
				});
				updateMyPresence({
					message: null,
				});
			}
		};

		const onKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === '/') {
				event.preventDefault();
			}
		};

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('keyup', onKeyUp);
		};
	}, [updateMyPresence]);

	return (
		<div
			className="h-screen w-full flex items-center justify-center text-center"
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
		>
			{cursor && (
				<CursorChat
					cursor={cursor}
					cursorState={cursorState}
					setCursorState={setCursorState}
					updateMyPresence={updateMyPresence}
				/>
			)}
			<LiveCursors others={others} />
		</div>
	);
};
