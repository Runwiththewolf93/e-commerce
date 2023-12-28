import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const useFetchState = (fetchAction, fetchParams, isDataEmpty) => {
  const dispatch = useDispatch();
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
