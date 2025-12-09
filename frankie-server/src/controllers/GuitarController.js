const { Client: NotionClient } = require("@notionhq/client");

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

module.exports = {
  async get(req, res) {
    try {
      const database = await notion.databases.query({
        database_id: process.env.NOTION_GUITAR,
      });

      const studies = database.results.map(study => {
        const { title, music, feeling, categories, practice_time, created_date, obs } = study.properties;
        console.log(study.properties.created_date);
        return {
          id: study.id,
          title: title.title[0]?.text.content || '',
          music: music.rich_text[0]?.text.content || '',
          feeling: feeling.select?.name || '',
          categories: categories.multi_select.map(g => ({ name: g.name, color: g.color })),
          practice_time: practice_time.number || 0,
          obs: obs.rich_text[0]?.text.content || '',
          created_date: created_date.date?.start || study.created_time
        };
      });
      
      res.json(studies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch guitar studies", details: error.message });
    }
  },

  async post(req, res) {
    try {
      const { title, difficulty, genre, technique, notes } = req.body;

      const newStudy = await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_GUITAR
        },
        properties: {
          title: { title: [{ text: { content: title } }] },
          difficulty: { select: { name: difficulty || 'Beginner' } },
          genre: { multi_select: genre?.map(g => ({ name: g })) || [] },
          technique: { multi_select: technique?.map(t => ({ name: t })) || [] },
          status: { select: { name: 'To Practice' } },
          practice_time: { number: 0 },
          notes: { rich_text: [{ text: { content: notes || '' } }] },
          created_date: { date: { start: new Date().toISOString() } }
        }
      });

      // Retornar o estudo criado no formato padronizado
      const { title: studyTitle, difficulty: studyDifficulty, genre: studyGenre, technique: studyTechnique, status: studyStatus, practice_time: studyPracticeTime, notes: studyNotes, created_date: studyCreatedDate } = newStudy.properties;

      res.json({
        id: newStudy.id,
        title: studyTitle.title[0]?.text.content || '',
        difficulty: studyDifficulty.select?.name || 'Beginner',
        genre: studyGenre.multi_select.map(g => ({ name: g.name, color: g.color })),
        technique: studyTechnique.multi_select.map(t => ({ name: t.name, color: t.color })),
        status: studyStatus.select?.name || 'To Practice',
        practice_time: studyPracticeTime.number || 0,
        notes: studyNotes.rich_text[0]?.text.content || '',
        created_date: studyCreatedDate.date?.start || newStudy.created_time
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create guitar study", details: error.message });
    }
  },

  // async patch(req, res) {
  //   try {
  //     const { id, title, difficulty, genre, technique, status, practice_time, notes } = req.body;
      
  //     const updateProperties = {};
      
    

  //     await notion.pages.update({
  //       page_id: id,
  //       properties: updateProperties
  //     });

  //     res.status(200).json({ message: 'Guitar study updated successfully' });
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to update guitar study", details: error.message });
  //   }
  // },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      await notion.pages.update({
        page_id: id,
        archived: true
      });

      res.status(200).json({ message: 'Guitar study deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete guitar study", details: error.message });
    }
  }
};