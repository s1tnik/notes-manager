import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICard, List } from "../types";

export interface ListsState {
  [key: string]: Omit<List, "id">;
}

const initialState: ListsState = {};

export const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<List>) => {
      const { id, ...list } = action.payload;
      state[id] = list;
    },
    removeList: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    insertList: (
      state,
      action: PayloadAction<{
        draggableList?: {
          list: List;
          index: number;
        };
        hoveredList?: {
          list: List;
          index: number;
          from: "left" | "right";
        };
      }>
    ) => {
      const { draggableList, hoveredList } = action.payload;

      if (!hoveredList) {
        return state;
      }

      if (draggableList) {
        const stateKeys = Object.keys(state);
        const filteredKeys = stateKeys.filter((key) => key !== draggableList.list.id);

        const hoveredListIndex = filteredKeys.findIndex((key) => key === hoveredList.list.id);
        const insertIndex = hoveredList.from === "right" ? hoveredListIndex + 1 : hoveredListIndex;

        filteredKeys.splice(insertIndex, 0, draggableList.list.id);

        const updatedState: typeof state = {};

        for (const key of filteredKeys) {
          updatedState[key] = state[key];
        }

        return updatedState;
      }
    },

    addCard: (state, action: PayloadAction<{ listId: string; card: ICard }>) => {
      const { listId, card } = action.payload;
      state[listId].cards.push(card);
    },
    removeCard: (state, action: PayloadAction<{ listId: string; card: ICard }>) => {
      const { listId, card } = action.payload;
      const filteredCards = state[listId].cards.filter(({ id }) => id !== card.id);
      state[listId].cards = filteredCards;
    },
    changeCard: (
      state,
      action: PayloadAction<{ listId: string; cardIndex: number; cardData: Omit<ICard, "id"> }>
    ) => {
      const { listId, cardData, cardIndex } = action.payload;
      const card = state[listId].cards[cardIndex];
      state[listId].cards[cardIndex] = { ...card, ...cardData };
    },
    insertCard: (
      state,
      action: PayloadAction<{
        draggableCard?: {
          card: ICard;
          index: number;
          listId: string;
        };
        hoveredCard?: {
          card?: ICard;
          index?: number;
          from?: "top" | "bottom";
          listId: string;
          shallowCard?: boolean;
        };
      }>
    ) => {
      const { draggableCard, hoveredCard } = action.payload;

      if (!hoveredCard) {
        return state;
      }

      if (draggableCard) {
        if (draggableCard.listId === hoveredCard.listId) {
          const filteredList = state[hoveredCard.listId].cards.filter(
            ({ id }) => id !== draggableCard.card.id
          );

          if (hoveredCard.shallowCard) {
            filteredList.push(draggableCard.card);
            state[hoveredCard.listId].cards = filteredList;
            return;
          }

          const hoveredCardIndex = filteredList.findIndex(({ id }) => id === hoveredCard.card?.id);
          const insertIndex =
            hoveredCard.from === "bottom" ? hoveredCardIndex + 1 : hoveredCardIndex;

          filteredList.splice(insertIndex, 0, draggableCard.card);
          state[hoveredCard.listId].cards = filteredList;
        } else {
          if (hoveredCard.shallowCard) {
            state[draggableCard.listId].cards.splice(draggableCard.index, 1);
            state[hoveredCard.listId].cards.push(draggableCard.card);
            return;
          }

          const hoveredCardIndex = state[hoveredCard.listId].cards.findIndex(
            ({ id }) => id === hoveredCard.card?.id
          );
          const insertIndex =
            hoveredCard.from === "bottom" ? hoveredCardIndex + 1 : hoveredCardIndex;

          if (hoveredCardIndex === -1) {
            return state;
          }

          state[draggableCard.listId].cards.splice(draggableCard.index, 1);
          state[hoveredCard.listId].cards.splice(insertIndex, 0, draggableCard.card);
        }
      }
    }
  }
});

export const { addList, removeList, addCard, removeCard, insertCard, insertList, changeCard } =
  listsSlice.actions;

export default listsSlice.reducer;
