const { Client: NotionClient } = require("@notionhq/client");

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

module.exports = {
  async get(req, res) {
    const database = await notion.databases.query({
      database_id: process.env.NOTION_BOOKS,
    });

    const books = database.results.map(book => {
      const { name, genres, rating, done, author, poster } = book.properties;
      const posterURL = poster.files[0] ? poster.files[0].external.url : null;
      return {
        id: book.id,
        author: author.rich_text[0].text.content,
        name: name.title[0].text.content,
        genres: genres.multi_select.map(gender => ({ name: gender.name, color: gender.color })),
        rating: rating.select?.name ? rating.select?.name : null,
        done: done.checkbox,
        poster: posterURL
      };
    });
    res.json(books);
  },

  async search(req, res) {
  },

  async post(req, res) {
    const { name, author, coverURL } = req.body;

    notion.pages.create({
      parent: {
        database_id: process.env.NOTION_BOOKS
      },
      properties: {
        name: { title: [{ text: { content: name } }] },
        author: { rich_text: [{ text: { content: author } }] },
        poster: {
          files: [
            { name: poster, type: 'external', external: { url: coverURL } }
          ]
        }
      }
    }).then((data) => {
      res.json({
        id: data.id,
        name: data.properties.name.title[0].text.content,
        author: data.properties.author.rich_text[0].text.content,
        genres: data.properties.genres.multi_select,
        rating: data.properties.rating.select?.name,
        done: data.properties.done.checkbox,
        poster: data.properties.poster.files[0].external.url
      });
    }).catch((error) => {
      res.status(500).json({ error: "Failed to create book", details: error });
    });
  },
};