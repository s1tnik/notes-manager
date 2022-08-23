import React from "react";
import {useDrop} from "react-dnd";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../app/hooks";
import {insertCard, insertList} from "../../app/listsSlice";
import {RootState} from "../../app/store";
import { ThemeContext } from "../../context/themeContext";
import {ItemTypes} from "../../types";
import styles from "./styles.module.scss"

interface DndWrapperProps {
    children: React.ReactNode;
}

export const DndWrapper: React.FC<DndWrapperProps> = ({children}) => {

    const dispatch = useAppDispatch();
    const {
        draggableCard,
        hoveredCard,
        draggableList,
        hoveredList
    } = useSelector((state: RootState) => state.dragging);

    const theme = React.useContext(ThemeContext);

    const [, drop] = useDrop(() => ({
        accept: [ItemTypes.CARD, ItemTypes.LIST],
        drop: (_, monitor) => {
            const itemType = monitor.getItemType();

            if (itemType === ItemTypes.CARD) {
                dispatch(insertCard({draggableCard, hoveredCard}))
            }

            if (itemType === ItemTypes.LIST) {
                dispatch(insertList({hoveredList, draggableList}))
            }
        },
    }), [draggableCard, hoveredCard, hoveredList, draggableList])

    return (
        <div ref={drop} className={`${styles.dndWrapper} ${styles[theme]} p-xl`}>{children}</div>
    )
}
