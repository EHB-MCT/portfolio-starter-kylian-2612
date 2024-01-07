/**
 * Check the title of a new artwork post.
 *
 * @param {string} title - Artwork title.
 * @returns {boolean} False if no match, true if the right type.
 */
function checkArtworkTitle(title) {
    if (
      title == null ||
      title.length <= 1 ||
      typeof title !== "string" ||
      title.length > 20 ||
      !/^[a-zA-Z0-9 ]+$/.test(title)
    ) {
      return false;
    }
    return true;
  }
  
  /**
   * Check the geohash location of the artwork.
   *
   * @param {string} location - Artwork location geohash.
   * @returns {boolean} False if no match, true if the right type.
   */
  function checkArtworkLocation(location) {
    if (
      location == null ||
      typeof location !== "string" ||
      location.length <= 1 ||
      location.length >= 20 ||
      !/^[a-z0-9]+$/.test(location)
    ) {
      return false;
    }
    return true;
  }
  
  /**
   * Check the image URL of the artwork.
   *
   * @param {string} image - Artwork image URL.
   * @returns {boolean} False if no match, true if the right type.
   */
  function checkArtworkImage(image) {
    if (
      image == null ||
      image.length <= 1 ||
      typeof image !== "string" ||
      image.length >= 255 ||
      !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(image)
    ) {
      return false;
    }
    return true;
  }
  
  module.exports = {
    checkArtworkTitle,
    checkArtworkLocation,
    checkArtworkImage,
  };
  