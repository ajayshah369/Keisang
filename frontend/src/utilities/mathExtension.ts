declare global {
  interface Math {
    ceilToNearest(num: number): number;
  }
}

Math.ceilToNearest = function (num: number) {
  const digits = Math.pow(10, Math.floor(Math.log10(num)));
  return Math.ceil(num / digits) * digits;
};

export {};
