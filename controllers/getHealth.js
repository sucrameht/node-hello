const getHealth = (req, res) => {
    res.json({status: 'OK', uptime: process.uptime()});
};

module.exports = {getHealth};