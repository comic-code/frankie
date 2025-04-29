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

  async post(req, res) {
    const { label, priority, averageValue } = req.body;
    notion.pages.create({
      parent: {
        database_id: process.env.NOTION_WISHLIST
      },
      properties: {
        label: { title: [{text: {content: label}}] },
        priority: {select: priority},
        averageValue: {number: averageValue},
        done: {checkbox: false},
      }
    }).then((data) => {
      res.json({genres: data.properties.genres.multi_select, ...req.body})
    });
  },
}