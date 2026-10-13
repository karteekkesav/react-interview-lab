import { decrement, increment, reset, setStep } from './counterSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export default function ReduxExample() {
  const count = useAppSelector((state) => state.counter.value)
  const step = useAppSelector((state) => state.counter.step)
  const dispatch = useAppDispatch()

  return (
    <div className="demo-stack">
      <div className="demo-card">
        <div>
          <h3>Redux Counter</h3>
          <p>
            The component reads state with `useSelector` and updates state by
            dispatching actions from `counterSlice`.
          </p>
        </div>
        <strong>Count: {count}</strong>
      </div>

      <label className="field-row">
        Step value
        <input
          type="number"
          min="1"
          value={step}
          onChange={(event) => dispatch(setStep(Number(event.target.value)))}
        />
      </label>

      <div className="button-row">
        <button type="button" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <button type="button" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button type="button" onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>

      <div className="demo-card">
        <div>
          <h3>What happened?</h3>
          <p>
            Button click dispatches an action. Redux Toolkit runs the reducer,
            updates the store immutably with Immer, and React re-renders this
            component with the new selected value.
          </p>
        </div>
        <strong>dispatch - reducer - store - UI</strong>
      </div>
    </div>
  )
}
