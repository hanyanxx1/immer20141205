import { useState, useRef } from "react";
import { toProxy, INTERNAL } from "./core";
import * as is from "./is";

function useImmerState(baseState) {
  const [state, setState] = useState(baseState);
  const draftRef = useRef(
    toProxy(baseState, () => {
      queueMicrotask(() => {
        const internalState = draftRef.current[INTERNAL];
        const newState = internalState.draftState;
        setState(() => {
          return is.isArray(newState)
            ? [...newState]
            : Object.assign({}, newState);
        });
      });
    }),
  );
  const updateDraft = (producer) => producer(draftRef.current);
  return [state, updateDraft];
}

export default useImmerState;
