import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICard} from '../types';

export interface DraggingState {
    isDragging: boolean;
    fromList?: string;
    toList?: string;
    draggableCard?: {
        card: ICard;
        height: number;
    };
    hoveredCard?: {
        card: ICard;
        from: "top" | "bottom"
    }
}

const initialState: DraggingState = {
    isDragging: false,
};
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
        setIsDragging: (state, action: PayloadAction<DraggingState['isDragging']>) => {
            state.isDragging = action.payload;
        },
        setHoveredCard: (state, action: PayloadAction<DraggingState['hoveredCard']>) => {
            state.hoveredCard = action.payload
        },
        resetDraggingState: (state) => {
            state = initialState;
        }
    },
});

export const {setFromList, setToList, setDraggableCard, setIsDragging, setHoveredCard, resetDraggingState} = draggingSlice.actions;

export default draggingSlice.reducer;
