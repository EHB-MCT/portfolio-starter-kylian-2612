/**
 * Checks if the provided value is a valid artist birth year.
 *
 * @param {string|number|null|boolean|undefined} value - The value to be checked for a valid artist birth year.
 * @returns {boolean} Returns true if the value is a valid artist birth year, otherwise false.
 */
const { checkArtistBirthyear } = require("../../helpers/artistEndpointHelpers.js");

test("check birthyear", () => {
    // Check for empty input
    expect(checkArtistBirthyear("")).toBe(false);

    // Check for a null input
    expect(checkArtistBirthyear(null)).toBe(false);

    // Check for a number in string
    expect(checkArtistBirthyear("1990")).toBe(false);

    // Check for a numeric name
    expect(checkArtistBirthyear(1)).toBe(false);
    expect(checkArtistBirthyear(false)).toBe(false);
    expect(checkArtistBirthyear(undefined)).toBe(false);

    // Check for invalid birth year (long year)
    expect(checkArtistBirthyear(12345)).toBe(false);

    // Check for invalid characters
    expect(checkArtistBirthyear("Ae8&")).toBe(false);

    // Check for negative number
    expect(checkArtistBirthyear(-1990)).toBe(false);

    // Check for floats
    expect(checkArtistBirthyear(1995.6)).toBe(false);

    // Check for a valid birth year
    expect(checkArtistBirthyear(2001)).toBe(true);
});
