require("dotenv").config();
const igdb = require("igdb-api-node").default;
const axios = require("axios").default;
const { getGenres, getPlatforms } = require("./tgdb-utils");

let platforms;
let genres;

async function gamePlatforms() {
  return platforms || await getPlatforms();
}

async function gameGenres() {
  return genres || await getGenres();
}

gamePlatforms().then(result => platforms = result);
gameGenres().then(result => genres = result);

module.exports = {
  async gameSearch(gameForSearch) {
    return axios({
      url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      method: "POST",
    }).then(async (res) => {
      const { access_token } = res.data;

      const search = await igdb(process.env.TWITCH_ID, access_token)
        .fields([
          "name",
          "artworks",
          "alternative_names",
          "aggregated_rating",
          "involved_companies",
          "aggregated_rating_count",
          "bundles",
          "collection",
          "cover",
          "dlcs",
          "expanded_games",
          "expansions",
          "first_release_date",
          "franchise",
          "genres",
          "keywords",
          "parent_game",
          "platforms",
          "total_rating",
          "total_rating_count",
          "storyline",
          "url",
          "summary",
          "videos",
        ])
        .search(gameForSearch)
        .where(
          "category = 0 | category = 1 | category = 2 | category = 3 | category = 6 | category = 4 | category = 8 | category = 9"
        )
        .request("/games");
  
      const promises = search.data.map(async (result) => {
        const { cover } = result;
  
        return new Promise(async (resolve) => {
          if (cover) {
            const covers = await igdb(
              process.env.TWITCH_ID,
              access_token
            )
              .fields(["url", "width", "animated", "height", "game"])
              .where(`id = ${cover}`)
              .request("/covers");
  
            resolve({
              ...result,
              genres: result.genres ? result.genres.map(genre => genres.find(el => el.id === genre)) : [],
              poster: covers.data[0].url.replace(
                "t_thumb",
                "t_cover_big"
              ),
            });
          } else {
            resolve(result);
          }
        });
      });
  
      return Promise.all(promises).then((result) => result);
    });
  },

}
