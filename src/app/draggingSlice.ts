import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {List, ICard} from '../types';

export interface DraggingState {
    draggableCard?: {
        card: ICard;
        height: number;
        index: number;
        listId: string;
    };
    hoveredCard?: {
        card?: ICard;
        from?: "top" | "bottom"
        index?: number;
        listId: string;
        shallowCard?: boolean;
    }

    draggableList?: {
        list: List;
        height: number;
        index: number;
    };
    hoveredList?: {
        list: List;
        from: "left" | "right"
        index: number;
    }
}

const initialState: DraggingState = {};
export const draggingSlice = createSlice({
    name: 'draggable card',
    initialState,
    reducers: {
        setDraggableCard: (state, action: PayloadAction<DraggingState['draggableCard']>) => {
            state.draggableCard = action.payload;
        },
        setHoveredCard: (state, action: PayloadAction<DraggingState['hoveredCard']>) => {
            state.hoveredCard = action.payload
        },
        setDraggableList: (state, action: PayloadAction<DraggingState['draggableList']>) => {
            state.draggableList = action.payload;
        },
        setHoveredList: (state, action: PayloadAction<DraggingState['hoveredList']>) => {
            state.hoveredList = action.payload
        },
        resetDraggingState: (state) => {
            return initialState;
        },
    },
});

export const {
    setDraggableCard,
    setHoveredCard,
    resetDraggingState,
    setDraggableList,
    setHoveredList
} = draggingSlice.actions;

export default draggingSlice.reducer;
