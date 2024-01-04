const{checkArtistBirthyear} = require("../../helpers/artistBirthyearEndHelper")
 
test("check birthyear", () => {
    //check for empty input
    expect(checkArtistBirthyear("")).toBe(false);
    //check for a null input
    expect(checkArtistBirthyear(null)).toBe(false);
    //check for a number in string
    expect(checkArtistBirthyear("1")).toBe(false);
    //check for a numeric name
    expect(checkArtistBirthyear(1)).toBe(false);
    expect(checkArtistBirthyear(false)).toBe(false);
    expect(checkArtistBirthyear(undefined)).toBe(false);
    //check for invalid characters
    expect(checkArtistBirthyear("Ae8&")).toBe(false);
    
    expect(checkArtistBirthyear("1452")).toBe(true);
    expect(checkArtistBirthyear("2001")).toBe(true);
} )

// Additional test for an edge case (e.g., maximum length)
test('check maximum length image URL', () => {
    // Assuming a maximum length of 255 characters (for example purposes)
    const longYear = "https://example.com/" + "2".repeat(5) + ".jpg";
    expect(checkArtistBirthyear(longYear)).toBe(false);
});