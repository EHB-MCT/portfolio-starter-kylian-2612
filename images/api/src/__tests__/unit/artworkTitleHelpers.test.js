const { checkArtworkTitle } = require("../../helpers/artworkEndpointHelpers.js");

/**
 * Test for the checkArtworkTitle function.
 * @param {string} title - The title of the artwork to be checked.
 */
test("check title", () => {
    // Check for empty input
    expect(checkArtworkTitle("")).toBe(false);

    // Check for a null input
    expect(checkArtworkTitle(null)).toBe(false);

    // Check for a short name
    expect(checkArtworkTitle("i")).toBe(false);

    // Check for a numeric name
    expect(checkArtworkTitle(1)).toBe(false);

    // Check for an insanely long name
    expect(checkArtworkTitle("pijdbzkjbepjsbdmbupicvbdpijdbphxkjcvLMDIhcxmlknvcmkmkjvbmkj")).toBe(false);

    // Check for valid artwork titles
    expect(checkArtworkTitle("mona lisa")).toBe(true);
    expect(checkArtworkTitle("flower")).toBe(true);
});
