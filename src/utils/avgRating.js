export default function GetAvgRating(ratingArr) {
  console.log("Input ratingArr:", ratingArr);

  if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0;

  const totalReviewCount = ratingArr.reduce((acc, curr) => {
    console.log("Current item:", typeof(curr));

    if (typeof curr.rating === 'number') {
      acc += curr.rating;
    }
    return acc;
  }, 0);

  const validRatingsCount = ratingArr.filter(curr => typeof curr.rating === 'number').length;
  if (validRatingsCount === 0) return 0;

  const multiplier = Math.pow(10, 1);
  const avgReviewCount =
    Math.round((totalReviewCount / validRatingsCount) * multiplier) / multiplier;
  console.log("avgReviewCount............", avgReviewCount);
  return avgReviewCount;
}
