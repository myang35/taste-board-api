export const stringUtils = {
  firstUpper: (data: string) => {
    if (!data) return "";
    return data[0].toUpperCase() + data.slice(1);
  },
};
