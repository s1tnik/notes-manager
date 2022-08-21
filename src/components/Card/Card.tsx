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
import {AiOutlineClose, AiOutlineEllipsis} from "react-icons/ai";
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

    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const handleCardValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "title" | 'description') => {
        setCardValues(prev => ({...prev, [type]: e.target.value}))
    }

    const handleSaveDescription = () => {
        setIsEditingDescription(false)
    }

    const handleCancelDescription = () => {
        setIsEditingDescription(false);
        setCardValues(prev => ({...prev, description: card.description}))
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
                    <div onClick={(e) => {
                        if (!(e.target as Element).closest(".text-area") && isEditingDescription) {
                            handleSaveDescription();
                        }
                    }} className={styles.modal}>
                        <div className="title-container">
                            <div className="input-container">
                                <input autoFocus className={!cardValues.title ? styles.focus : ""}
                                       onChange={(e) => handleCardValueChange(e, "title")} value={cardValues.title}
                                       type="text"/>
                                <span onClick={closeModal}><AiOutlineClose/></span>
                            </div>
                            <p>In list "{list.name}"</p>
                        </div>
                        <div className="description-and-actions">
                            <div className="description-container">
                                <div>
                                    <h2>Description</h2>
                                    {!isEditingDescription &&
                                    <button onClick={() => setIsEditingDescription(true)}>Edit</button>}
                                </div>
                                {isEditingDescription ? <div className="text-area">
                                            <textarea onChange={(e) => handleCardValueChange(e, "description")}
                                                      autoFocus
                                                      value={cardValues.description}/>
                                        <div>
                                            <button onClick={handleSaveDescription}>Save</button>
                                            <button onClick={handleCancelDescription}>Cancel</button>
                                        </div>
                                    </div> :
                                    <p onClick={() => setIsEditingDescription(true)}>{cardValues.description}</p>
                                }
                            </div>
                            <div className="actions">
                                <h2>Actions</h2>
                                <button>Delete</button>
                            </div>
                        </div>
                    </div>
                </Popup>
                {renderShallowCard && hoveredCard?.from === "top" &&
                <EmptyCard style={{height: draggableCard?.height}}/>}

                <div onClick={() => setOpen(o => !o)} ref={mergeRefs([drag, drop, cardRef])} className={styles.card}>
                    <p className="title">{title}</p>
                    {description && <p className="description">{description.length > 150 ? <>{description.slice(0, 150)}
                        <AiOutlineEllipsis/></> : description}</p>}
                </div>

                {renderShallowCard && hoveredCard?.from === "bottom" &&
                <EmptyCard style={{height: draggableCard?.height}}/>}
            </>
        )
    }

    return null;
}
