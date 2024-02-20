const { WebhookClient, EmbedBuilder } = require('discord.js')
const config = require('../config.json')
const webhook = new WebhookClient({ url: config.webhook })


/**
 * 
 * @param {string} title 
 * @param {string} message 
 */
function createStatusEmbed(title, message, color = 0x00FFFF) {

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color).addFields({ name: "status", value: message });

    return embed
}


/**
 * @param {EmbedBuilder} embed
 */
async function sendEmbed(embed) {

    webhook.send({
        username: 'Network Status',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });
}


module.exports = {
    createStatusEmbed, sendEmbed
}