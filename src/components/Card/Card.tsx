import React, {useEffect, useRef, useState} from "react";
import styles from "./styles.module.scss"
import {useDrag, useDrop} from 'react-dnd'
import {ICard, ItemTypes} from '../../types/index'
import {useAppDispatch} from "../../app/hooks";
import {setDraggableCard, setHoveredCard, resetDraggingState} from "../../app/draggingSlice"
import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {mergeRefs} from "react-merge-refs";
import EmptyCard from "../EmptyCard";
import Popup from "reactjs-popup";
import {AiFillEdit, AiOutlineAlignLeft, AiOutlineClose} from "react-icons/ai";
import {changeCard} from "../../app/listsSlice";

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
    const {hoveredCard, draggableCard, list} = useSelector((state: RootState) => ({
        ...state.dragging,
        list: state.lists[listId]
    }));

    const cardRef = useRef<HTMLDivElement>(null);

    const [cardValues, setCardValues] = useState({title: card.title, description: card.description});

    const handleCardValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "title" | 'description') => {
        setCardValues(prev => ({...prev, [type]: e.target.value}))
    }

    const [open, setOpen] = useState(false);
    const closeModal = () => {
        if (!cardValues.title) return;
        setOpen(false);
        dispatch(changeCard({cardData: cardValues, listId, cardIndex: index}))
    };

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

        const renderShallowCard = !!hoveredCard && id === hoveredCard.card?.id;

        return (
            <>
                <Popup open={open} closeOnDocumentClick={!!cardValues.title} onClose={closeModal}>
                    <div className={styles.modal}>
                        <div>
                            <div className="title-container">
                                <span><AiFillEdit/></span>
                                <div>
                                    <input autoFocus className={!cardValues.title ? styles.focus : ""}
                                           onChange={(e) => handleCardValueChange(e, "title")} value={cardValues.title}
                                           type="text"/>
                                    <p>In list "{list.name}"</p>
                                </div>
                            </div>
                            <div className="description-container">
                                <span><AiOutlineAlignLeft/></span>
                                <div>
                                    <input onChange={(e) => handleCardValueChange(e, "description")}
                                           value={cardValues.description} type="text"/>
                                </div>
                            </div>
                        </div>
                        <span onClick={closeModal}><AiOutlineClose/></span>
                    </div>
                </Popup>
                {renderShallowCard && hoveredCard?.from === "top" &&
                <EmptyCard style={{height: draggableCard?.height}}/>}

                <div onClick={() => setOpen(o => !o)} ref={mergeRefs([drag, drop, cardRef])} className={styles.card}>
                    <p className="title">{title}</p>
                    {description && <span><AiOutlineAlignLeft/></span>}
                </div>

                {renderShallowCard && hoveredCard?.from === "bottom" &&
                <EmptyCard style={{height: draggableCard?.height}}/>}
            </>
        )
    }

    return null;
}
