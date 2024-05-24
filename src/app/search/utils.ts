export const getDayDifference = (postedAt: string, soldAt: string) => {
  const date1 = new Date(postedAt);
  const date2 = new Date(soldAt);

  // Calculate the difference in time (milliseconds)
  const differenceInTime = Math.abs(date2.getTime() - date1.getTime());

  // Convert the difference in time to days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
};
