/**
 * check Artnumber of new artist on post
 * @param: artist Artnumber 
 * @returns: false if no match, true if right type
 */

function checkArtistNumArtworks(Artnumber){ 
    if(
        Artnumber == null 
        || typeof(Artnumber) !== "string" 
        || Artnumber.length > 255
        || !/^[0-9]+$/.test(Artnumber)
    ) {
        return false
    }
    return true
}
module.exports = {
    checkArtistNumArtworks
}