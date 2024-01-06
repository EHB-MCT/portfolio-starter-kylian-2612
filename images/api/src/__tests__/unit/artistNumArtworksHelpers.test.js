const{checkArtistNumArtworks} = require("../../helpers/artistEndpointHelpers.js")

test("check Artnumber", () => {
    //check for empty input
    expect(checkArtistNumArtworks("")).toBe(false);
    //check for a null input
    expect(checkArtistNumArtworks(null)).toBe(false); 
    //check for a number in string
    expect(checkArtistNumArtworks("1990")).toBe(false);
    expect(checkArtistNumArtworks(false)).toBe(false);
    expect(checkArtistNumArtworks(undefined)).toBe(false);
    //check for invalid characters
    expect(checkArtistNumArtworks("Ae8&")).toBe(false);
    //check for invalid amount of artworks
    expect(checkArtistNumArtworks(1254366)).toBe(false);
    //check for negative number
    expect(checkArtistNumArtworks(-1990)).toBe(false);
    //check for floats
    expect(checkArtistNumArtworks(1995.6)).toBe(false);
    
    expect(checkArtistNumArtworks(6)).toBe(true);
    expect(checkArtistNumArtworks(55248)).toBe(true);
})

