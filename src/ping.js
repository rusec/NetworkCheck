const axios = require('axios')
var exec = require('node:child_process').execSync;
const os = require('os')
function isValidIP(ip) {
    // Regular expression for IPv4 address pattern
    var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

    // Check if the IP matches the pattern
    var match = ipPattern.exec(ip);

    if (match === null) {
        return false; // If the IP doesn't match the pattern
    }

    // Check each segment of the IP address
    for (var i = 1; i <= 4; i++) {
        if (parseInt(match[i], 10) > 255 || parseInt(match[i], 10) < 0) {
            return false; // If any segment is greater than 255 or less than 0
        }
    }

    return true; // If the IP passes all the checks
}



/**
 * 
 * @param {string} host 
 */
async function ping(host) {
    try {
        new URL(host);
    } catch (error) {
        if (!isValidIP(host)) throw new Error("not a host or url")
        else return await pingServer(host)
    }

    try {
        await axios.get(host);

        return true;
    } catch (error) {
        console.log(error.cause)
        return false
    }
}

async function pingServer(host) {
    try {
        let result;
        if (os.platform() === 'win32') {
            result = exec(`ping -n 3 ${host}`).toString()
        } else {
            result = exec(`ping -c 3 ${host}`).toString()

        }
        if (result.includes('Request timed out')) {
            console.log(result)
            return false;
        }
        if (result.includes('Please')) {
            console.log(result)
            return false;
        }
        return true;

    } catch (error) {
        console.log(error.message)
        return false
    }
}


module.exports = {
    ping
}