export default function isJson(
  /* eslint-disable @typescript-eslint/no-explicit-any */ item: any
): boolean {
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
