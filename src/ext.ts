Array.prototype.toSorted = function (this, compareFn) {
  const copy = [...this];

  return copy.sort(compareFn);
};
