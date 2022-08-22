import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from "axios";
import { Advertisement } from '../types';

export const fetchAdById = createAsyncThunk(
    'ad/fetchByIdStatus',
    async (postId, thunkAPI) => {
        const response = await axios.get<Advertisement>("https://jsonplaceholder.typicode.com/posts/" + postId)
        return response.data
    }
)

export interface AdvertisementState {
    usedAdvertisemens: number[];
    currentAdd?: Advertisement;
    status: "idle" | "failed" | "loading"
}

const initialState: AdvertisementState = {
    usedAdvertisemens: [],
    status: "idle"
};

const advertisementSlice = createSlice({
    name: 'ad',
    initialState,
    reducers: {
        resetadvertisementState: (state) => {
            return initialState;
        },
    },
extraReducers: (builder) => {
  builder
    .addCase(fetchAdById.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchAdById.fulfilled, (state, action) => {
      state.status = 'idle';

      if (action.payload) {
          state.currentAdd = action.payload;
          state.usedAdvertisemens.push(action.payload.id)
      }

    })
    .addCase(fetchAdById.rejected, (state) => {
      state.status = 'failed';
    });
},
})

export const {resetadvertisementState} = advertisementSlice.actions;


export default advertisementSlice.reducer;
