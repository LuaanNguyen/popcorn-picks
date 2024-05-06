import { useState, useEffect } from "react";

export function useLocalStorageStage(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value)); //storing movies into local storage
    },
    [value, key]
  );

  return [value, setValue];
}
