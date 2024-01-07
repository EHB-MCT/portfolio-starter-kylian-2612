const { checkArtistNumArtworks } = require("../../helpers/artistEndpointHelpers.js");

/**
 * @param {string} input - The input to check for the number of artworks.
 * @returns {boolean} Returns true if the input is a valid number of artworks, otherwise false.
 */
test("check Artnumber", () => {
    // Check for empty input
    expect(checkArtistNumArtworks("")).toBe(false);

    // Check for null input
    expect(checkArtistNumArtworks(null)).toBe(false);

    // Check for a number in string
    expect(checkArtistNumArtworks("1990")).toBe(false);
    expect(checkArtistNumArtworks(false)).toBe(false);
    expect(checkArtistNumArtworks(undefined)).toBe(false);

    // Check for invalid characters
    expect(checkArtistNumArtworks("Ae8&")).toBe(false);

    // Check for invalid amount of artworks
    expect(checkArtistNumArtworks(1254366)).toBe(false);

    // Check for negative number
    expect(checkArtistNumArtworks(-1990)).toBe(false);

    // Check for floats
    expect(checkArtistNumArtworks(1995.6)).toBe(false);

    // Check for valid number of artworks
    expect(checkArtistNumArtworks(6)).toBe(true);
    expect(checkArtistNumArtworks(55248)).toBe(true);
});
