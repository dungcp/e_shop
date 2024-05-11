export const truncateText = (str: string) => {
    if(str.length < 25) return str;
    return str.substring(0, 25) + '...'
};

export const productRating = (data: any) => {
  return data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
  data.reviews.length;
}