export const isValidImageUrl = (url: unknown): url is string => {
  return (
    typeof url === "string" &&
    url.trim().length > 0 &&
    url.startsWith("http") &&
    /\.(jpg|jpeg|png|webp|avif|svg)(\?.*)?$/i.test(url)
  );
};
