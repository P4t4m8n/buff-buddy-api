export const dbUtil = {
  cleanData: (obj: any) => {
    const cleaned: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined && obj[key] !== "" && obj[key] !== null) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  },
};
