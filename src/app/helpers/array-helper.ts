
export function subtractArraysByComparator<T>(
  list: T[],
  listToRemove: T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  return list.filter(item =>
    !listToRemove.some(itemToRemove => comparator(item, itemToRemove))
  );
}

// Subtrai os elementos de listToRemove de list, comparando os elementos pelo atributo 'id'.
export function subtractArraysById<T extends { id: any }>(
  list: T[],
  listToRemove: T[]
): T[] {
  return subtractArraysByComparator(list, listToRemove, (a, b) => a.id === b.id);
}