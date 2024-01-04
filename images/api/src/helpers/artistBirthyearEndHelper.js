/**
 * check birthyear of new artist on post
 * @param: artwork birthyear 
 * @returns: false if no match, true if right type
 */

function checkArtistBirthyear(birthyear){ 
    if(
        birthyear == null 
        || birthyear.length <=1 
        || typeof(birthyear) !== "string" 
        || birthyear.length > 4
        || !/^[0-9]+$/.test(birthyear)
    ) {
        return false
    }
    return true
}
module.exports = {
    checkArtistBirthyear
}