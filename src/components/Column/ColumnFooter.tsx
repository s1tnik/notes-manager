import React from "react"
import {useDrop} from "react-dnd"
import {useSelector} from "react-redux"
import { setHoveredCard } from "../../app/draggingSlice"
import { useAppDispatch } from "../../app/hooks"
import {RootState} from "../../app/store"
import {ItemTypes} from "../../types"
import EmptyCard from "../EmptyCard"
import styles from "./styles.module.scss"

interface ColumnFooterProps {
    onClick: () => void;
    listId: string;
}

export const ColumnFooter: React.FC<ColumnFooterProps> = ({onClick, listId}) => {

    const {hoveredCard, draggableCard} = useSelector((state: RootState) => (state.dragging));

    const dispatch = useAppDispatch();

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        hover: (_, monitor) => {
            dispatch(setHoveredCard({shallowCard: true, listId }))
        }
    }))


    return (
        <div ref={drop} className={styles.columnFooter}>
            {hoveredCard?.listId === listId && hoveredCard?.shallowCard && <EmptyCard style={{height: draggableCard?.height}}/>}
            <EmptyCard onClick={onClick} title="+ Add new card"/>
        </div>
    )
}
