const{checkArtistBirthyear} = require("../../helpers/artistEndpointHelpers.js")
 
test("check birthyear", () => {
    //check for empty input
    expect(checkArtistBirthyear("")).toBe(false);
    //check for a null input
    expect(checkArtistBirthyear(null)).toBe(false);
    //check for a number in string
    expect(checkArtistBirthyear("1990")).toBe(false);
    //check for a numeric name
    expect(checkArtistBirthyear(1)).toBe(false);
    expect(checkArtistBirthyear(false)).toBe(false);
    expect(checkArtistBirthyear(undefined)).toBe(false);
    //check for invalid birthyear long year
    expect(checkArtistBirthyear(12345)).toBe(false)
    //check for invalid characters
    expect(checkArtistBirthyear("Ae8&")).toBe(false);
    //check for negative number
    expect(checkArtistBirthyear(-1990)).toBe(false);
    //check for floats
    expect(checkArtistBirthyear(1995.6)).toBe(false);
    
    expect(checkArtistBirthyear(2001)).toBe(true);
} )
