import { QUERY_TAIL_KEY } from "../constants/storage";

export const getQueryTail = () => {
  const search = window.location.search;

  if (search && search.length > 1) {
    localStorage.setItem(QUERY_TAIL_KEY, search);
    return search;
  }

  return localStorage.getItem(QUERY_TAIL_KEY) || "";
};
