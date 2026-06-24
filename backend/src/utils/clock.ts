let isSimulated = false;
let simulatedTime: number | null = null;

export const getNow = (): string => {
  if (isSimulated && simulatedTime !== null) {
    return new Date(simulatedTime).toISOString();
  }
  return new Date().toISOString();
};

export const setSimulatedTime = (isoString: string) => {
  isSimulated = true;
  simulatedTime = new Date(isoString).getTime();
};

export const clearSimulatedTime = () => {
  isSimulated = false;
  simulatedTime = null;
};
