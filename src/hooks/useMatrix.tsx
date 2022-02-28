import { useState, useEffect } from 'react';

export default function useMatrix(n: number) {
  const [availables, setAvailables] = useState<number[]>([])
  function availableHandler(n: number) {
    if ([1, 5, 9, 13].includes(n)) {
      setAvailables([n + 1, n - 4, n + 4])
    }
    if ([4, 8, 12, 16].includes(n)) {
      setAvailables([n - 1, n - 4, n + 4])
    }
    setAvailables([n - 1, n + 1, n + 4, n - 4])
  }
  //return availables.map((num: number) => num > 0 && num <= 16)
  return [availables, availableHandler]
}
