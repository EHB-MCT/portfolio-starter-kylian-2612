/**
 * check image url of the artwork
 * @param: artwork image-url
 * @returns: false if no match, true if right type
 */

function checkArtworkImage(image) {
    if (
        image == null 
        ||image.length <= 1 
        ||typeof image !== "string" 
        ||image.length >= 255
        ||!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(image)
    ) {
        return false;
    }
    return true;
    
}

module.exports = {
    checkArtworkImage
};