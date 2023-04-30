export const parseBoolean = (value: string): boolean => {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
    throw new Error(`Invalid boolean string: ${value}`);
  };
  