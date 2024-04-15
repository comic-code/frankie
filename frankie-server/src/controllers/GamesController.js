const { Client: NotionClient} = require("@notionhq/client");
const { gameSearch } = require("../services/tgdb");

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

module.exports = {
  async get(req, res) {
    const database = await notion.databases.query({
      database_id: process.env.NOTION_GAMES,
      sorts: [
        {property: "done", direction: "ascending"}
      ]
    });
    
    const games = database.results.map(game => {
      const { name, genres, rating, done, poster, release, notes, done_date, done_achievements} = game.properties;
      const posterURL = poster.files[0] ? poster.files[0].external.url : null;

      return {
        id: game.id,
        name: name.title[0].text.content,
        notes: notes ? notes.rich_text[0]?.plain_text : null,
        genres: genres.multi_select.map(gender => ({name: gender.name, color: gender.color})),
        rating: rating.select?.name ? rating.select?.name : null,
        done: done.checkbox,
        doneDate: done_date.date ? done_date.date.start : null,
        poster: posterURL,
        release: release.date?.start,
        doneAchievements: done_achievements.checkbox
      }
    })
    res.json(games);
  },

  async search(req, res) {
    const { q } = req.query;
    const searchResult = await gameSearch(q);
    res.json(searchResult);
  },

  async post(req, res) {
    const { name, poster, genres, rating, first_release_date, done } = req.body;
    const release = new Date(first_release_date * 1000).toISOString().substring(0, 10);
    notion.pages.create({
      parent: {
        database_id: process.env.NOTION_GAMES
      },
      properties: {
        name: { title: [{text: {content: name}}] },
        done: {checkbox: done || false},
        genres: {multi_select: genres.map(genre => ({name: genre.name}))},
        poster: {files: [
          { name: poster, type: 'external', external: { url: 'https:' + poster }}
        ]},
        rating: {select: rating ? {name: rating} : null},
        release: {date: {start: release}},
        done_date: {date: done 
          ? {
            start: new Date().toISOString().substring(0, 10) 
          }
          : null
        }
      }
    }).then((data) => {
      res.json({genres: data.properties.genres.multi_select, ...req.body})
    });
  },
}