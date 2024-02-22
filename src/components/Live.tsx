'use client';
import { CursorChat } from '@/components/cursor/CursorChat';
import { LiveCursors } from '@/components/cursor/LiveCursors';
import FlyingReaction from '@/components/reaction/FlyingReaction';
import ReactionSelector from '@/components/reaction/ReactionButton';
import useInterval from '@/hooks/useInterval';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type';
import React, { PointerEvent, useCallback, useEffect, useState } from 'react';
import {
	useBroadcastEvent,
	useEventListener,
	useMyPresence,
	useOthers,
} from '../../liveblocks.config';

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
	const [reactions, setReactions] = useState<Reaction[]>([]);
	const broadcast = useBroadcastEvent();

	useInterval(() => {
		setReactions((reactions) =>
			reactions.filter((reaction) => Date.now() - reaction.timestamp < 4000)
		);
	}, 1000);

	useInterval(() => {
		if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
			setReactions((reactions) => {
				return reactions.concat([
					{
						point: { x: cursor.x, y: cursor.y },
						value: cursorState.reaction,
						timestamp: Date.now(),
					},
				]);
			});
		}

		if (cursorState.mode === CursorMode.Reaction) {
			broadcast({
				x: cursor?.x,
				y: cursor?.y,
				value: cursorState.reaction,
			});
		}
	}, 100);

	useEventListener((eventData) => {
		const event = eventData.event as ReactionEvent;
		setReactions((reactions) => {
			return reactions.concat([
				{
					point: { x: event.x, y: event.y },
					value: event.value,
					timestamp: Date.now(),
				},
			]);
		});
	});

	const handlePointerMove = useCallback((event: PointerEvent) => {
		event.preventDefault();
		const { clientX, clientY } = event;

		if (!cursor && cursorState.mode !== CursorMode.ReactionSelector) {
			const x = clientX - event.currentTarget.getBoundingClientRect().x;
			const y = clientY - event.currentTarget.getBoundingClientRect().y;

			updateMyPresence({
				cursor: {
					x,
					y,
				},
			});
		}
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

	const handlePointerDown = useCallback(
		(event: PointerEvent) => {
			const { clientX, clientY } = event;
			const x = clientX - event.currentTarget.getBoundingClientRect().x;
			const y = clientY - event.currentTarget.getBoundingClientRect().y;

			updateMyPresence({
				cursor: {
					x,
					y,
				},
			});

			setCursorState((state: CursorState) => {
				return state.mode === CursorMode.Reaction
					? { ...state, isPressed: true }
					: state;
			});
		},
		[cursorState.mode]
	);

	const handlePointerUp = useCallback(() => {
		setCursorState((state: CursorState) => {
			return state.mode === CursorMode.Reaction
				? { ...state, isPressed: true }
				: state;
		});
	}, [cursorState.mode]);

	const cursor = (myPresence as PresenceType).cursor;

	const setReaction = useCallback((reaction: string) => {
		setCursorState({
			reaction,
			mode: CursorMode.Reaction,
			isPressed: false,
		});
	}, []);

	useEffect(() => {
		const onKeyUp = (event: globalThis.KeyboardEvent) => {
			const key = event.key;
			if (key === '/') {
				setCursorState({
					mode: CursorMode.Chat,
					previousMessage: null,
					message: '',
				});
			} else if (key === 'Escape') {
				setCursorState({
					mode: CursorMode.Hidden,
				});
				updateMyPresence({
					message: null,
				});
			} else if (key === 'e') {
				setCursorState({
					mode: CursorMode.ReactionSelector,
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
			onPointerUp={handlePointerUp}
		>
			{reactions.map((reaction, index) => (
				<FlyingReaction
					key={index}
					value={reaction.value}
					x={reaction.point.x}
					y={reaction.point.y}
					timestamp={reaction.timestamp}
				/>
			))}

			{cursor && (
				<CursorChat
					cursor={cursor}
					cursorState={cursorState}
					setCursorState={setCursorState}
					updateMyPresence={updateMyPresence}
				/>
			)}

			{cursorState.mode === CursorMode.ReactionSelector && (
				<ReactionSelector setReaction={setReaction} />
			)}

			<LiveCursors others={others} />
		</div>
	);
};
