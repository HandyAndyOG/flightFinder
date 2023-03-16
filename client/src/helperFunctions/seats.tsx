export const seats = (num: number) => {
    return Array.from({ length: num + 1 }, (_, i) => i);
  };