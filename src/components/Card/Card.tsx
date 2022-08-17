import React, {useEffect, useRef} from "react";
import styles from "./styles.module.scss"
import {useDrag, useDrop} from 'react-dnd'
import {ICard, ItemTypes} from '../../types/index'
import {useAppDispatch} from "../../app/hooks";
import {setDraggableCard, setHoveredCard, resetDraggingState} from "../../app/draggingSlice"
import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {mergeRefs} from "react-merge-refs";
import EmptyCard from "../EmptyCard";

interface CardProps {
    card: ICard
    onClick?: () => void;
    listId: string;
    listIndex: number;
    index: number;
}

export const Card: React.FC<CardProps> = ({card, listId, onClick, listIndex, index}) => {

    const {id, title, description} = card;

    const dispatch = useAppDispatch();
    const {hoveredCard, draggableCard} = useSelector((state: RootState) => state.dragging);

    const cardRef = useRef<HTMLDivElement>(null);

    const [{isDraggingCard}, drag] = useDrag(() => ({
        type: ItemTypes.CARD,
        end: () => {
            dispatch(resetDraggingState())
        },
        collect: monitor => ({
            isDraggingCard: monitor.isDragging(),
        }),
    }))

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        hover: (_, monitor) => {
            const clientOffset = monitor.getClientOffset();

            if (!cardRef.current || !clientOffset) return;

            const rect = cardRef.current.getBoundingClientRect();
            const y = clientOffset.y - rect.top;
            const height = rect.height;

            if (y > height / 2) {
                dispatch(setHoveredCard({from: "bottom", card, index, listId}))
            } else {
                dispatch(setHoveredCard({from: "top", card, index, listId}))
            }

        },

    }))

    useEffect(() => {

        if (draggableCard?.card.id !== id && cardRef.current && isDraggingCard) {
            dispatch(setDraggableCard({card, height: cardRef.current.clientHeight, index, listId}));
        }

    }, [card, dispatch, isDraggingCard, listId, listIndex, index, draggableCard, id]);


    if (draggableCard?.card.id === id && !hoveredCard) {
        return <EmptyCard style={{height: draggableCard?.height}}/>
    }

    if (!draggableCard || draggableCard.card.id !== card.id) {

        const renderShallowCard = !!hoveredCard && id === hoveredCard.card.id;

        return (
            <>
                {renderShallowCard && hoveredCard?.from === "top" &&
                <EmptyCard style={{height: draggableCard?.height}}/>}

                <div ref={mergeRefs([drag, drop, cardRef])} className={styles.card}>
                    <p className="title">{title}</p>
                    {description && <p className="description">{description}</p>}
                </div>

                {renderShallowCard && hoveredCard?.from === "bottom" &&
                <EmptyCard style={{height: draggableCard?.height}}/>}
            </>
        )
    }

    return null;
}
