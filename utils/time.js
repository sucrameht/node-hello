function getCurrentServerTime() {
    return new Date().toISOString();
}

module.exports = {getCurrentServerTime};