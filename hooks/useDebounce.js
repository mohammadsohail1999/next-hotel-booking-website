import React, { useEffect, useState } from "react";

const useDebounce = (searchTerm, timeInterval) => {
  const [term, setTerm] = useState("");

  useEffect(() => {
    let interval = setTimeout(() => {
      setTerm(searchTerm);
    }, timeInterval);

    return () => {
      clearInterval(interval);
    };
  }, [searchTerm]);

  return term;
};

export default useDebounce;
