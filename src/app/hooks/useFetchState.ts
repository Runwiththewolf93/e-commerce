import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "../hooks/reactReduxHooks";
import { AsyncThunk } from "@reduxjs/toolkit";

interface FetchParams {
  jwt?: string;
}

type FetchAction<T = any, P = FetchParams, R = any> = AsyncThunk<T, P, R>;

const useFetchState = (
  fetchAction: FetchAction,
  fetchParams: FetchParams,
  isDataEmpty: boolean
) => {
  const dispatch = useAppDispatch();
  const [hasFetched, setHasFetched] = useState(false);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (fetchParams?.jwt && isDataEmpty && !initialFetchDone.current) {
      initialFetchDone.current = true;
      dispatch(fetchAction(fetchParams)).finally(() => setHasFetched(true));
    }
  }, [dispatch, fetchAction, fetchParams, isDataEmpty]);

  return { hasFetched };
};

export default useFetchState;
