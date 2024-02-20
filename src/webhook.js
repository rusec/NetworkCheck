const { WebhookClient, EmbedBuilder } = require('discord.js')
const config = require('../config.json')
const webhook = new WebhookClient({ url: config.webhook })


/**
 * 
 * @param {string} title 
 * @param {string} message 
 */
function createStatusEmbed(title, color = 0x00FFFF) {

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color);

    return embed
}


/**
 * @param {EmbedBuilder} embed
 * @param {string} content
 * 
 */
async function sendEmbed(embed, content) {

    webhook.send({
        content: content,
        username: 'Network Status',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });
}


module.exports = {
    createStatusEmbed, sendEmbed
}