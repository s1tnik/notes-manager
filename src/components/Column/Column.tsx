import React from "react"
import {useAppDispatch} from "../../app/hooks"
import {v4 as uuidv4} from 'uuid';
import {addCard, insertCard} from "../../app/listsSlice"
import {ItemTypes, List} from "../../types"
import Card from "../Card"
import EmptyCard from "../EmptyCard"
import {ColumnHeader} from "./ColumnHeader"
import styles from "./styles.module.scss"
import {useDrop} from "react-dnd";
import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {setToList, setHoveredCard} from "../../app/draggingSlice";

export const Column: React.FC<List> = ({name, cards, id: listId}) => {

    const dispatch = useAppDispatch();
    const {
        fromList,
        toList,
        draggableCard,
        isDragging,
        hoveredCard
    } = useSelector((state: RootState) => state.dragging);

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,

        hover: (_, monitor) => {
            dispatch(setToList(listId))

            const offset = monitor.getClientOffset();

            if (!offset) return;

            const hoveredElement = window.document.elementFromPoint(offset.x, offset.y);

            if (!hoveredElement) return;

            if (hoveredElement.className === styles.column && !!cards.length) {
                dispatch(setHoveredCard({card: cards[cards.length - 1], from: "bottom"}))
            }


        },
        drop: () => {

        },
    }), [fromList, toList, draggableCard, listId, isDragging])

    const onAddCard = (): void => {
        dispatch(addCard({listId, card: {title: uuidv4(), id: uuidv4()}}))
    }

    return (
        <div ref={drop} className={styles.column}>
            <div>
                <ColumnHeader header={name}/>
                {!!cards.length && cards.map((card) => <Card listId={listId} card={card}/>)}
                {!cards.length && toList === listId && isDragging &&
                <EmptyCard style={{height: draggableCard?.height}}/>}
                <EmptyCard onClick={onAddCard} title="+ Add new card"/>
            </div>
        </div>
    )
}


