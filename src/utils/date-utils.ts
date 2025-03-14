export const dateUtils = {
  createDateAfter: (ms: number) => {
    const date = new Date();
    date.setMilliseconds(date.getMilliseconds() + ms);
    return date;
  },
};
