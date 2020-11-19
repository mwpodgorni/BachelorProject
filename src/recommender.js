export default async function Recommender(initialData) {
  //   async generateSuggestions(initialData) {
  //   }
  //   return 2;
  initialData.suggestions = 3;
  initialData.recentlyPlayed.forEach((element) => {
    console.log(element.title);
  });

  return initialData;
}
