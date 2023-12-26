import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const useFetchState = (fetchAction, fetchParams, isDataEmpty) => {
  const dispatch = useDispatch();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (fetchParams?.jwt && isDataEmpty) {
      dispatch(fetchAction(fetchParams)).finally(() => setHasFetched(true));
    }
  }, [dispatch, fetchAction, fetchParams, isDataEmpty]);

  return { hasFetched };
};

export default useFetchState;
