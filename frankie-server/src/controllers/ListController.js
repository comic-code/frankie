const { Client: NotionClient} = require("@notionhq/client");
const { gameSearch } = require("../services/tgdb");

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

module.exports = {
  async get(req, res) {
    const database = await notion.databases.query({
      database_id: process.env.NOTION_WISHLIST,
      sorts: [
        {property: "done", direction: "ascending"}
      ]
    });
    
    const list = database.results.map(item => {
      const { label, priority, averageValue } = item.properties;

      return {
        label: label.title[0]?.text.content || '',
        priority: priority.select?.name || '',
        averageValue: averageValue.number || 0
      }
    })
    res.json(list);
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