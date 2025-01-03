const regex =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?/;
export function youtubeVideo(part: string) {
  const arr = part.match(regex);

  if (arr) return arr[5];

  return undefined;
}
