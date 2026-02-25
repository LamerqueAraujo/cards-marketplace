export function toggleSelection(
  list: string[],
  value: string
): string[] {
  const index = list.indexOf(value)

  if (index === -1) {
    return [...list, value]
  }

  const newList = [...list]
  newList.splice(index, 1)
  return newList
}
