import { QUERY_TAIL_KEY, SESSION_ID_KEY } from "../constants/storage";
import { loadData, saveData } from "./idbStorage";

export const getQueryTail = async () => {
  const search = window.location.search;

  let tailParams: URLSearchParams;

  if (search && search.length > 1) {
    tailParams = new URLSearchParams(search);
  } else {
    const saved = await loadData(QUERY_TAIL_KEY);
    tailParams = new URLSearchParams(saved);
  }

  const sessionId = await loadData(SESSION_ID_KEY);
  console.log(sessionId);

  if (sessionId) {
    const existing = tailParams.toString();
    const finalTail = `?user_id=${sessionId}${existing ? "&" + existing : ""}`;

    await saveData(QUERY_TAIL_KEY, finalTail);

    return finalTail;
  }

  const finalTail = search || (await loadData(QUERY_TAIL_KEY)) || "";
  await saveData(QUERY_TAIL_KEY, finalTail);

  return finalTail;
};
