const axios = require("axios");
const { description } = require("commander");
const contentful = require('contentful-management');
require('dotenv').config();

async function Connect() {
  let client = await contentful.createClient({
    accessToken: "CFPAT-v_hjP09um7rzuEsAg0UzvJcpyfB5a4ubTiH9PJXp6ew"
  });
  let space = await client.getSpace('zqirvn9va129');
  return await space.getEnvironment('master');
}

module.exports = async function() {
  try {
    const env = await Connect();
    const data = await env.getEntries();
    const media = await env.getAssets("media");
    const mediaItems = media.items;
    const mediaData = mediaItems.map(item => item.fields.file['en-US'].url); 
    const sanitizedData = data.items.map((item, idx) => {
      const { fields } = item;    
      return {
        name: fields['name']['en-US'],
        description: fields['description']['en-US'],
        avatar: mediaData[idx]
      }
    });

    return sanitizedData;
  } catch (error) {
    console.error(error);
  }

};