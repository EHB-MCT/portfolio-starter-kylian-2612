const { checkArtistName } = require("../../helpers/artistEndpointHelpers.js");

/**
 * Test the checkArtistName function.
 *
 * @param {string} name - The name to be checked.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
test("check name", () => {
    // Check for empty input
    expect(checkArtistName("")).toBe(false);

    // Check for a null input
    expect(checkArtistName(null)).toBe(false);

    // Check for a short name
    expect(checkArtistName("i")).toBe(false);

    // Check for a numeric name
    expect(checkArtistName(1)).toBe(false);

    // Check for a number in string
    expect(checkArtistName("1")).toBe(false);

    // Check for boolean input
    expect(checkArtistName(false)).toBe(false);

    // Check for undefined input
    expect(checkArtistName(undefined)).toBe(false);

    // Check for an insanely long name
    expect(checkArtistName("pijdbzkjbepjsbdmbupicvbdpijdbphxkjcvLMDIhcxmlknvcmkmkjvbmkj")).toBe(false);

    // Check for invalid characters
    expect(checkArtistName("Bobby@")).toBe(false);

    // Check for valid names
    expect(checkArtistName("Leonardo da Vinci")).toBe(true);
    expect(checkArtistName("flower")).toBe(true);
});
