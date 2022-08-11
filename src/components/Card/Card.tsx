import React, {useEffect, useRef} from "react";
import styles from "./styles.module.scss"
import {useDrag, useDrop} from 'react-dnd'
import {ICard, ItemTypes} from '../../types/index'
import {useAppDispatch} from "../../app/hooks";
import {setFromList, setDraggableCard, setHoveredCard, resetDraggingState} from "../../app/draggingSlice"
import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {mergeRefs} from "react-merge-refs";
import EmptyCard from "../EmptyCard";

interface CardProps {
    card: ICard
    onClick?: () => void;
    listId: string;
}

export const Card: React.FC<CardProps> = ({card, listId, onClick}) => {

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
                dispatch(setHoveredCard({from: "bottom", card}))
            } else {
                dispatch(setHoveredCard({from: "top", card}))
            }
        },

    }), [cardRef.current])

    useEffect(() => {

        if (cardRef.current && isDraggingCard) {
            const card = {title, description, id}
            dispatch(setDraggableCard({card, height: cardRef.current.clientHeight}));
            dispatch(setFromList(listId));
        }

    }, [isDraggingCard, description, dispatch, id, listId, title]);


    const renderShallowCard = id === hoveredCard?.card.id;

    return (
        <>
            {renderShallowCard && hoveredCard?.from === "top" &&
            <EmptyCard style={{height: draggableCard?.height}}/>}

            {(!draggableCard || draggableCard.card.id !== card.id) &&
            <div ref={mergeRefs([drag, drop, cardRef])} className={styles.card}>
                <p className="title">{title}</p>
                {description && <p className="description">{description}</p>}
            </div>
            }

            {!draggableCard && isDraggingCard && <EmptyCard style={{height: cardRef.current?.clientHeight}}/>}

            {renderShallowCard && hoveredCard?.from === "bottom" &&
            <EmptyCard style={{height: draggableCard?.height}}/>}
        </>
    )
}
