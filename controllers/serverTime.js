const {getCurrentServerTime} = require('../utils/time');

const getServerTime = (req, res) => {
    const timeNow = getCurrentServerTime();
    res.send(`Current server time is ${timeNow}`);
};

module.exports = {getServerTime};