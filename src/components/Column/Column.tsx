import React, {useEffect, useRef} from "react"
import {useAppDispatch} from "../../app/hooks"
import {v4 as uuidv4} from 'uuid';
import {addCard} from "../../app/listsSlice"
import {ItemTypes, List} from "../../types"
import Card from "../Card"
import EmptyCard from "../EmptyCard"
import {ColumnHeader} from "./ColumnHeader"
import styles from "./styles.module.scss"
import {useDrag, useDrop} from "react-dnd";
import {useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {mergeRefs} from "react-merge-refs";
import {setToList, setHoveredCard, setDraggableList, setHoveredList, resetDraggingState} from "../../app/draggingSlice";

interface ColumnProps {
    list: List;
    index: number
}

export const Column: React.FC<ColumnProps> = ({list, index}) => {

    const {cards, id, name} = list;

    const columnRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const {
        fromList,
        toList,
        draggableList,
        hoveredList,
        draggableCard,
        hoveredCard
    } = useSelector((state: RootState) => state.dragging);

    const [{isDraggingList}, drag] = useDrag(() => ({
        type: ItemTypes.LIST,
        end: () => {
            dispatch(resetDraggingState())
        },
        collect: (monitor) => ({
            isDraggingList: !!monitor.isDragging(),
        })
    }))

    const [, drop] = useDrop(() => ({
        accept: [ItemTypes.CARD, ItemTypes.LIST],
        hover: (_, monitor) => {
            dispatch(setToList({index, id}));

            if (toList?.id !== id) {
                dispatch(setHoveredCard(undefined));
            }

            const itemType = monitor.getItemType();
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) return;

            if (itemType === ItemTypes.LIST && columnRef.current) {
                const rect = columnRef.current.getBoundingClientRect();
                const x = clientOffset.x - rect.left;
                const width = rect.width;

                if (x > width / 2) {
                    dispatch(setHoveredList({from: "right", list, index}))
                } else {
                    dispatch(setHoveredList({from: "left", list, index}))
                }
            }
        },
    }), [fromList, toList, index, id, list])

    useEffect(() => {

        if (columnRef.current && isDraggingList) {
            dispatch(setDraggableList({list, height: columnRef.current.clientHeight, index}));
        }

    }, [isDraggingList, dispatch, index, list]);

    const onAddCard = (): void => {
        dispatch(addCard({listId: id, card: {title: uuidv4(), id: uuidv4()}}))
    }


    if (!draggableList || draggableList.list.id !== list.id) {

        const renderShallowList = !!hoveredList && id === hoveredList.list.id;

        return (
            <>
                {renderShallowList && hoveredList?.from === "left" &&
                <EmptyCard style={{height: draggableList?.height}}/>}

                <div ref={drop} className={styles.wrapper}>
                    <div ref={mergeRefs([drag, columnRef])} className="column">
                        <ColumnHeader header={name}/>
                        {!!cards.length && cards.map((card, cardIndex) => <Card index={cardIndex} listIndex={index}
                                                                                key={card.id} listId={id}
                                                                                card={card}/>)}
                        {toList?.id === list.id && draggableCard && !hoveredCard &&
                        <EmptyCard style={{height: draggableCard.height}}/>}
                        <EmptyCard onClick={onAddCard} title="+ Add new card"/>
                    </div>
                </div>

                {renderShallowList && hoveredList?.from === "right" &&
                <EmptyCard style={{height: draggableList?.height}}/>}
            </>
        )
    }

    return null;
}

