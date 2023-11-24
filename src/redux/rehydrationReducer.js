"use client";

// rehydrationReducer.js
import { REHYDRATE } from "redux-persist";

console.log("This breaks state as well");

const rehydrationReducer = (state = null, action) => {
  if (action.type === REHYDRATE) {
    if (!action.payload) return state;

    console.log("This breaks state as well");
    // Create a new state excluding the _rehydrationLog
    const { _rehydrationLog, ...restOfState } = action.payload;
    return restOfState;
  }
  return state;
};

export default rehydrationReducer;

console.log("This breaks state");
