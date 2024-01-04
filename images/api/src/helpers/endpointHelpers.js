
/**
 * check title of new artwork on post
 * @param: artwork title 
 * @returns: false if no match, true if right type
 */

function checkArtworkTitle(title){ 
    if(
        title == null 
        || title.length <=1 
        || typeof(title) != "string" 
        || title.length > 20
        || !/^[a-zA-Z0-9 ]+$/.test(title)
    ) {
        return false
    }
    return true
}
module.exports = {
    checkArtworkTitle
}