/**
 * Check the name of a new artist in a post
 * @param {string} name - Artist name 
 * @returns {boolean} - False if no match, true if the correct type
 */
function checkArtistName(name) { 
    if (
        name == null ||
        name.length <= 1 ||
        typeof name !== "string" ||
        name.length >= 20 ||
        !/^[a-zA-Z ]+$/.test(name)
    ) {
        return false;
    }
    return true;
}

/**
 * Check the birth year of a new artist in a post
 * @param {number} birthyear - Artist birth year 
 * @returns {boolean} - False if no match, true if the correct type
 */
function checkArtistBirthyear(birthyear) { 
    if (
        birthyear == null ||
        typeof birthyear !== "number" ||
        birthyear.toString().length !== 4 ||
        !/^\d+$/.test(birthyear)
    ) {
        return false;
    }
    return true;
}

/**
 * Check the art number of a new artist in a post
 * @param {number} numArtworks - Artist art number 
 * @returns {boolean} - False if no match, true if the correct type
 */
function checkArtistNumArtworks(numArtworks) {
    if (
        numArtworks == null ||
        typeof numArtworks !== "number" ||
        numArtworks < 0 || // Check for a negative number
        !Number.isInteger(numArtworks) || // Check for an integer
        !/^\d{1,6}$/.test(numArtworks.toString()) // Check for up to 6 digits
    ) {
        return false;
    }
    return true;
}

module.exports = {
    checkArtistName,
    checkArtistBirthyear,
    checkArtistNumArtworks
};
