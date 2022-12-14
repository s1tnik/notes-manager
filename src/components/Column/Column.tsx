import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { ItemTypes, List } from "../../types";
import Card from "../Card";
import EmptyCard from "../EmptyCard";
import { ColumnHeader } from "./ColumnHeader";
import styles from "./styles.module.scss";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { mergeRefs } from "react-merge-refs";
import { setDraggableList, setHoveredList, resetDraggingState } from "../../app/draggingSlice";
import { ColumnFooter } from "./ColumnFooter";

interface ColumnProps {
  list: List;
  index: number;
}

export const Column: React.FC<ColumnProps> = ({ list, index }) => {
  const { cards, id, name } = list;

  const columnRef = useRef<HTMLDivElement>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const dispatch = useAppDispatch();
  const { draggableList, hoveredList } = useSelector((state: RootState) => state.dragging);

  const [{ isDraggingList }, drag] = useDrag(() => ({
    type: ItemTypes.LIST,
    end: () => {
      dispatch(resetDraggingState());
    },
    collect: (monitor) => ({
      isDraggingList: !!monitor.isDragging()
    })
  }));

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.CARD, ItemTypes.LIST],
    hover: (_, monitor) => {
      const itemType = monitor.getItemType();

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !columnRef.current) return;

      const rect = columnRef.current.getBoundingClientRect();

      if (itemType === ItemTypes.LIST) {
        const x = clientOffset.x - rect.left;
        const width = rect.width;

        if (x > width / 2) {
          dispatch(setHoveredList({ from: "right", list, index }));
        } else {
          dispatch(setHoveredList({ from: "left", list, index }));
        }
      }
    }
  }));

  useEffect(() => {
    if (columnRef.current && isDraggingList && draggableList?.list.id !== id) {
      dispatch(setDraggableList({ list, height: columnRef.current.clientHeight, index }));
    }
  }, [isDraggingList, dispatch, index, list, draggableList, id]);

  if (draggableList?.list.id === id && !hoveredList) {
    return <EmptyCard style={{ height: draggableList?.height }} />;
  }

  if (!draggableList || draggableList.list.id !== list.id) {
    const renderShallowList = !!hoveredList && id === hoveredList.list.id;

    return (
      <>
        {renderShallowList && hoveredList?.from === "left" && (
          <EmptyCard style={{ height: draggableList?.height }} />
        )}

        <div ref={drop} className={styles.wrapper}>
          <div ref={mergeRefs([drag, columnRef])} className="column">
            <ColumnHeader setIsAddingCard={setIsAddingCard} listId={id} header={name} />
            {!!cards.length &&
              cards.map((card, cardIndex) => (
                <Card index={cardIndex} listIndex={index} key={card.id} listId={id} card={card} />
              ))}
          </div>
          <ColumnFooter isAddingCard={isAddingCard} setIsAddingCard={setIsAddingCard} listId={id} />
        </div>

        {renderShallowList && hoveredList?.from === "right" && (
          <EmptyCard style={{ height: draggableList?.height }} />
        )}
      </>
    );
  }

  return null;
};
