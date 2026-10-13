import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type CounterState = {
  value: number
  step: number
}

const initialState: CounterState = {
  value: 0,
  step: 1,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += state.step
    },
    decrement(state) {
      state.value -= state.step
    },
    reset(state) {
      state.value = 0
      state.step = 1
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload
    },
  },
})

export const { decrement, increment, reset, setStep } = counterSlice.actions
export default counterSlice.reducer
