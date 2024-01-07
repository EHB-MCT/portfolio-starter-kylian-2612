const { checkArtworkLocation } = require("../../helpers/artworkEndpointHelpers");

/**
 * Test for a specific case (e.g., valid)
 * @param {string} geohash - The geohash to be checked.
 */
test('check valid location geohash', () => {
    // Check for a short name
    expect(checkArtworkLocation("a")).toBe(false);
    
    // Check for empty input
    expect(checkArtworkLocation("")).toBe(false);
    
    // Check for a null input
    expect(checkArtworkLocation(null)).toBe(false);
    
    // Check for a numeric name
    expect(checkArtworkLocation(1)).toBe(false);
    expect(checkArtworkLocation(false)).toBe(false);
    expect(checkArtworkLocation(undefined)).toBe(false);
});

/**
 * Test for geohash with capital letters
 * @param {string} geohash - The geohash with capital letters to be checked.
 */
test('check geohash with capital letters', () => {
    expect(checkArtworkLocation("u4pRuyDqqVj")).toBe(false);
});

/**
 * Test for valid location geohash
 * @param {string} geohash - The valid geohash to be checked.
 */
test('check valid location geohash', () => {
    expect(checkArtworkLocation("u4pruydqqvj")).toBe(true);
});

/**
 * Test for invalid location geohash (no protocol)
 * @param {string} geohash - The invalid geohash with no protocol to be checked.
 */
test('check invalid location geohash (no protocol)', () => {
    const invalidGeohash = "invalid-location";
    expect(checkArtworkLocation(invalidGeohash)).toBe(false);
});

/**
 * Test for an edge case (e.g., maximum length)
 * @param {string} geohash - The geohash with maximum length to be checked.
 */
test('check maximum length location geohash', () => {
    const longGeohash = "a".repeat(21);
    expect(checkArtworkLocation(longGeohash)).toBe(false);
});
