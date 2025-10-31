export const parseURLParams = (url: URL) => {
  const parsedUrl = new URL(url);

  const pixelId = parsedUrl.searchParams.get("pixel_id") ?? "";
  const fbclId = parsedUrl.searchParams.get("fbclid") ?? "";

  parsedUrl.searchParams.delete("pixel_id");
  parsedUrl.searchParams.delete("fbclid");

  const remainingParams = parsedUrl.search
    ? parsedUrl.search.substring(1) // delete '?'
    : "";

  return {
    pixelId,
    fbclId,
    remainingParams,
  };
};
