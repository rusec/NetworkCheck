const config = require('./config.json');
const { ping } = require('./src/ping');
const { createStatusEmbed, sendEmbed } = require('./src/webhook');
let db = new Map();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
function formatDateTime(date) {
    // Get the month, day, year, hours, and minutes
    var month = date.toLocaleString('default', { month: 'long' });
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Format hours and minutes to ensure they are two digits
    hours = (hours < 10 ? '0' : '') + hours;
    minutes = (minutes < 10 ? '0' : '') + minutes;

    // Construct the formatted date and time string
    var formattedDateTime = month + ' ' + day + ', ' + year + ' ' + hours + ':' + minutes;

    return formattedDateTime;
}

async function pingAndSendWebhook(host) {
    try {
        let hasIp = db.has(host);
        let curr = false;
        if (!hasIp) db.set(host, false);
        else curr = db.get(host);
        let result = await ping(host);
        db.set(host, result)
        if (!result) {
            if (curr) {
                let embed = createStatusEmbed("Network Status", `Unable to connect to ${host} At ${formatDateTime(new Date())}`, 0xff1145)
                await sendEmbed(embed)
            }
            console.log("Unable to Connect to", host, `At ${formatDateTime(new Date())}`)
        } else {
            if (!curr) {
                let embed = createStatusEmbed("Network Status", `Connected to ${host} At ${formatDateTime(new Date())}`)
                await sendEmbed(embed)
            }

            console.log("Connected to", host, `At ${formatDateTime(new Date())}`)
        }
    } catch (error) {
        console.log(error)
    }

}

async function pingALL() {
    let ips = config.ips;
    let results = ips.map((host) => pingAndSendWebhook(host));
    await Promise.allSettled(results)
    await new Promise((resolve) => setTimeout(() => resolve(), 5000))
    return pingALL();
}

pingALL()


