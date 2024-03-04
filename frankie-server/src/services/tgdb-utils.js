const axios = require("axios");
const igdb = require("igdb-api-node").default;
const { Client: NotionClient} = require("@notionhq/client");
const fs = require('fs');

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

async function getAccessToken() {
  return axios({
    url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    method: "POST",
  }).then(response => response.data);
}

module.exports = {
  async getPlatforms() {
    const { access_token } = await getAccessToken();
    const platFormFields = ['name', 'generation', 'platform_logo', 'url']; 
    
    return igdb(process.env.TWITCH_CLIENT_ID, access_token)
    .fields(platFormFields)
    .limit(210)
    .request('/platforms').then(platformInfos => {
      igdb(process.env.TWITCH_CLIENT_ID, access_token)
        .fields(["url"])
        .limit(500)
        .request("/platform_logos")
        .then(platformLogos => {
          platforms = platformInfos.data.map(platformInfo => {
            const logo = platformLogos.data.find(el => el.id == platformInfo.platform_logo);
            if (!logo) return platformInfo;
          
            return {
              ...platformInfo,
              platform_logo: 'https:' + logo.url
                .replace('t_thumb', 't_logo_med')
                .replace('jpg', 'png')
            };
          });
  
          fs.writeFile('src/public/igdb.platforms.json', JSON.stringify(platforms, null, 4), err => {
            err && console.error(err);
          });
          console.log('✅: Games - Platforms');
        });
    });
  },

  async getGenres() {
    const { access_token } = await getAccessToken();
    return igdb(process.env.TWITCH_CLIENT_ID, access_token)
      .fields('name')
      .limit(500)
      .request('/genres')
      .then(genresResponse => {
        console.log('✅: Games - Genres');
        return genresResponse.data;
      });
  }
}

