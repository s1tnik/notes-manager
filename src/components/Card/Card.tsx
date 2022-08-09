import React, {useEffect, useRef} from "react";
import styles from "./styles.module.scss"
import {useDrag, useDrop} from 'react-dnd'
import {ICard, ItemTypes} from '../../types/index'
import {useAppDispatch} from "../../app/hooks";
import {setFromList, setDraggableCard, setIsDragging, setHoveredCard, resetDraggingState} from "../../app/draggingSlice"
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
    const {hoveredCard, isDragging, toList, draggableCard} = useSelector((state: RootState) => state.dragging);

    const cardRef = useRef<HTMLDivElement>(null);

    const [{isDraggingElement}, drag] = useDrag(() => ({
        type: ItemTypes.CARD,
        collect: monitor => ({
            isDraggingElement: !!monitor.isDragging(),
        }),
    }), [])

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        hover: (_, monitor) => {
            const clientOffset = monitor.getClientOffset();

            if (!cardRef.current || !clientOffset) return;

            const rect = cardRef.current.getBoundingClientRect();
            const y = clientOffset.y - rect.top;
            const height = rect.height;

            const hoveredCardCommonProps = {cardId: id, height: cardRef.current.clientHeight}

            if (y > height / 2) {
                dispatch(setHoveredCard({from: "bottom", card}))
            } else {
                dispatch(setHoveredCard({from: "top", card}))
            }
        },

    }))

    useEffect(() => {
        dispatch(setIsDragging(isDraggingElement));

        if (isDraggingElement && cardRef.current) {
            const card = {title, description, id}
            dispatch(setDraggableCard({card, height: cardRef.current.clientHeight}));
            dispatch(setFromList(listId));
        } else {
            dispatch(resetDraggingState())
        }


    }, [isDraggingElement, description, dispatch, id, listId, title]);


    const renderShallowCard = id === hoveredCard?.card.id && toList === listId && isDragging;


    return (
        <>
            {renderShallowCard && hoveredCard?.from === "top" &&
            <EmptyCard style={{height: draggableCard?.height}}/>}
            {!isDraggingElement ? <div ref={mergeRefs([drag, drop, cardRef])} className={styles.card}>
                <p className="title">{title}</p>
                {description && <p className="description">{description}</p>}
            </div> : null}
            {renderShallowCard && hoveredCard?.from === "bottom" &&
            <EmptyCard style={{height: draggableCard?.height}}/>}
        </>
    )
}
