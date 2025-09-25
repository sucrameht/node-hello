const {getCurrentServerTime} = require('../utils/time');

const getServerTime = (req, res) => {
    const timeNow = getCurrentServerTime();
    res.json({ nowUtcIso: timeNow, epochMs: Date.parse(timeNow) });
}

module.exports = {getServerTime};