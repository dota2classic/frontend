export const getTowerState = (buildingStatus: number, bit: number): boolean => {
  return (buildingStatus & (1 << bit)) !== 0;
};
