declare global {
  interface String {
    titleCase(): string;
  }
}

String.prototype.titleCase = function (): string {
  return this.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export {};
