import ContentBasedRecommender from "./content-based-recommender";
export default async function Recommendations(userData, games) {
  // console.log("suggestions generator", userData.suggestions);

  if (userData.favoriteGames.length) {
    let favoriteIds = [];
    userData.favoriteGames.forEach((element) => {
      favoriteIds.push(element.gameId);
    });
    let suggestionsData = createSuggestions(favoriteIds, games);
    userData.suggestions = formatSuggestions(suggestionsData, games, userData.favoriteGames);
  } else if (userData.recentlyPlayed.length) {
    let ids = [];
    userData.recentlyPlayed.forEach((element) => {
      ids.push(element.gameId);
    });

    let suggestionsData = createSuggestions(ids, games);
    userData.suggestions = formatSuggestions(suggestionsData, games, userData.favoriteGames);
  } else {
    return;
  }
}
function createSuggestions(input, games) {
  var formattedInput = formatInputData(input, games);
  var formattedGames = formatGamesData(games);
  const recommender = new ContentBasedRecommender();
  recommender.train(formattedGames);
  const similarGames = [];
  formattedInput.forEach((element) => {
    const scores = recommender.getSimilarDocuments(element.id);
    scores.forEach((item) => {
      if (item.score >= 0.15) {
        if (!containsObject(item, similarGames)) {
          similarGames.push(item);
        }
      }
    });
  });

  return similarGames;
}
function formatSuggestions(input, games, favorite) {
  input = removeFavoriteFromSuggestions(input, favorite);
  let formattedSuggestions = [];
  games.forEach((game) => {
    input.forEach((suggestion) => {
      if (suggestion.id === game.gameId) {
        let newSuggestion = {
          gameId: game.gameId,
          description: game.description,
          title: game.title,
          downloadURL: game.downloadURL,
        };
        formattedSuggestions.push(newSuggestion);
      }
    });
  });

  if (formattedSuggestions.length > 5) {
    formattedSuggestions = formattedSuggestions.slice(0, 5);
  }
  return formattedSuggestions;
}
function removeFavoriteFromSuggestions(input, favorite) {
  let ids = [];
  let cleanedInput = [];

  favorite.forEach((e) => {
    ids.push(e.gameId);
  });
  input.forEach((e) => {
    if (!ids.includes(e.id)) {
      cleanedInput.push(e);
    }
  });
  return cleanedInput;
}
function formatInputData(input, games) {
  let formattedData = [];
  input.forEach((element) => {
    games.forEach((game) => {
      if (element == game.gameId) {
        let keywords = "";
        game.keywords.forEach((keyword) => {
          keywords += keyword + " ";
        });
        keywords = keywords.slice(0, -1);
        formattedData.push({ id: element, content: keywords });
      }
    });
  });
  return formattedData;
}
function formatGamesData(games) {
  let formattedData = [];
  games.forEach((game) => {
    let keywords = "";
    game.keywords.forEach((keyword) => {
      keywords += keyword + " ";
    });
    keywords = keywords.slice(0, -1);
    formattedData.push({ id: game.gameId, content: keywords });
  });
  return formattedData;
}
function containsObject(obj, arr) {
  let ids = [];
  arr.forEach((item) => {
    ids.push(item.id);
  });
  if (ids.includes(obj.id)) {
    return true;
  } else {
    return false;
  }
}
