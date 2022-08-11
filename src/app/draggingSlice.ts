import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {List, ICard} from '../types';

export interface DraggingState {
    draggableCard?: {
        card: ICard;
        height: number;
        index: number;
    };
    hoveredCard?: {
        card: ICard;
        from: "top" | "bottom"
        index: number;
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

    fromList?: {
        index: number;
        id: string;
    };
    toList?: {
        index: number;
        id: string;
    }
}

const initialState: DraggingState = {};
export const draggingSlice = createSlice({
    name: 'draggable card',
    initialState,
    reducers: {
        setFromList: (state, action: PayloadAction<DraggingState['fromList']>) => {
            state.fromList = action.payload;
        },
        setToList: (state, action: PayloadAction<DraggingState['toList']>) => {
            state.toList = action.payload;
        },
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
    setFromList,
    setToList,
    setDraggableCard,
    setHoveredCard,
    resetDraggingState,
    setDraggableList,
    setHoveredList
} = draggingSlice.actions;

export default draggingSlice.reducer;
