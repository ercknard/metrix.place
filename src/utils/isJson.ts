export default function isJson(item: any /* eslint-disable-line */): boolean {
  try {
    item = typeof item !== 'string' ? JSON.stringify(item) : item;
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }
  if (typeof item === 'object' && item !== null) {
    return true;
  }
  return false;
}
