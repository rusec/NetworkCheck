const config = require('./config.json');
const { ping } = require('./src/ping');
const { createStatusEmbed, sendEmbed } = require('./src/webhook');
let db = new Map();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


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
                let embed = createStatusEmbed("Network Status", `Unable to connect to ${host} At ${(new Date()).toISOString()}`)
                await sendEmbed(embed)
            }
            console.log("Unable to Connect to", host, `At ${(new Date()).toISOString()}`)
        } else console.log("Connected to", host, `At ${(new Date()).toISOString()}`)
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


