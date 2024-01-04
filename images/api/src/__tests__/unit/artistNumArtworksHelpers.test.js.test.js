const{checkArtistNumArtworks} = require("../../helpers/artistArtnumberEndpointHelper")

test("check Artnumber", () => {
    //check for empty input
    expect(checkArtistNumArtworks("")).toBe(false);
    //check for a null input
    expect(checkArtistNumArtworks(null)).toBe(false);    
    //check for a numeric name
    expect(checkArtistNumArtworks(1)).toBe(false);
    expect(checkArtistNumArtworks(false)).toBe(false);
    expect(checkArtistNumArtworks(undefined)).toBe(false);
    //check for invalid characters
    expect(checkArtistNumArtworks("Ae8&")).toBe(false);
    
    expect(checkArtistNumArtworks("6")).toBe(true);
    expect(checkArtistNumArtworks("55248")).toBe(true);
})

test('check maximum length image URL', () => {
    // Assuming a maximum length of 255 characters (for example purposes)
    const longCount = "https://example.com/" + "2".repeat(256) + ".jpg";
    expect(checkArtistNumArtworks(longCount)).toBe(false);
});