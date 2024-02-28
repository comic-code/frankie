const { Client: NotionClient} = require("@notionhq/client");

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
      const { name, genres, rating, done, poster, release, notes, done_date} = game.properties;
      const posterURL = poster.files[0] ? poster.files[0].external.url : null;

      console.log(done_date);

      return {
        id: game.id,
        name: name.title[0].text.content,
        notes: notes ? notes.rich_text[0]?.plain_text : null,
        genres: genres.multi_select.map(gender => ({name: gender.name, color: gender.color})),
        rating: rating.select?.name ? rating.select?.name : null,
        done: done.checkbox,
        doneDate: done_date.date ? done_date.date.start : null,
        poster: posterURL,
        release: release.date?.start
      }
    })
    res.json(games)
  },
}