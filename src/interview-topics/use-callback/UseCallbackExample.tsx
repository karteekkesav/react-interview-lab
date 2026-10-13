import { memo, useCallback, useState } from "react";

type SaveButtonProps = {
  onSave: () => void;
};

const SaveButton = memo(function SaveButton({ onSave }: SaveButtonProps) {
  console.log("SaveButton rendered");

  return (
    <button type="button" onClick={onSave}>
      Save answer
    </button>
  );
});

export default function UseCallbackExample() {
  const [answer, setAnswer] = useState("Props are read-only inputs.");
  const [savedAnswer, setSavedAnswer] = useState("");
  const [count, setCount] = useState(0);

  const handleSave = useCallback(() => {
    console.log("handleSave called");
    setSavedAnswer(answer);
  }, [answer]);

  return (
    <div className="demo-stack">
      <p className="status-box">
        <strong>Interview point:</strong> useCallback memoizes the function
        reference. It does not stop the function from running when the Save
        button calls it.
      </p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Re-render parent: {count}
      </button>
      <label className="demo-form single-field">
        Interview answer
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          rows={4}
        />
      </label>
      <SaveButton onSave={handleSave} />
      <p className="status-box">
        <strong>Saved answer:</strong> {savedAnswer || "Nothing saved yet"}
      </p>
      <p className="status-box">
        Click <strong>Re-render parent</strong> without changing the answer:
        SaveButton can skip re-rendering because the same handleSave reference is
        reused. Click <strong>Save answer</strong>: handleSave still runs every
        time because the button executes it.
      </p>
    </div>
  );
}
