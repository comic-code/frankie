const { Client: NotionClient} = require("@notionhq/client");

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

module.exports = {
  async get(req, res) {
    const database = await notion.databases.query({
      database_id: process.env.NOTION_BOOKS,
    });
    
    const books = database.results.map(book => {
      const { name, genres, rating, done, author, poster} = book.properties;
      const posterURL = poster.files[0] ? poster.files[0].external.url : null 
      return {
        id: book.id,
        author: author.rich_text[0].text.content,
        name: name.title[0].text.content,
        genres: genres.multi_select.map(gender => ({name: gender.name, color: gender.color})),
        rating: rating.select?.name ? rating.select?.name : null,
        done: done.checkbox,
        poster: posterURL
      }
    })
    res.json(books)
  },

  async search(req, res) {

  },

  async post(req, res) {
    
  },
}