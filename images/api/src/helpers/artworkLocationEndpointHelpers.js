/**
 * Check location geohash of the artwork.
 * @param {string} location - Artwork location geohash. 
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtworkLocation(location) {
    if (
        location == null
        ||typeof location !== "string"
        ||location.length <= 1
        ||location.length >= 20
        ||!/^[a-z0-9]+$/.test(location)
    ) {
        return false;
    }
    return true;
}

module.exports = {
    checkArtworkLocation
};

