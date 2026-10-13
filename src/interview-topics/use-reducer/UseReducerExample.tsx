import { useReducer } from 'react'

type State = {
  step: number
  acceptedTerms: boolean
}

type Action =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'toggleTerms' }
  | { type: 'reset' }

const initialState: State = {
  step: 1,
  acceptedTerms: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next':
      return { ...state, step: Math.min(state.step + 1, 3) }
    case 'back':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'toggleTerms':
      return { ...state, acceptedTerms: !state.acceptedTerms }
    case 'reset':
      return initialState
    default:
      return state
  }
}

export default function UseReducerExample() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="demo-stack">
      <article className="demo-card">
        <div>
          <h3>Interview form step {state.step} of 3</h3>
          <p>
            Terms are {state.acceptedTerms ? 'accepted' : 'not accepted'}.
          </p>
        </div>
      </article>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={state.acceptedTerms}
          onChange={() => dispatch({ type: 'toggleTerms' })}
        />
        Accept terms
      </label>
      <div className="button-row">
        <button type="button" onClick={() => dispatch({ type: 'back' })}>
          Back
        </button>
        <button type="button" onClick={() => dispatch({ type: 'next' })}>
          Next
        </button>
        <button type="button" onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </button>
      </div>
    </div>
  )
}
