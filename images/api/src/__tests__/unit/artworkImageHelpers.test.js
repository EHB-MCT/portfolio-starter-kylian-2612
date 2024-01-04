const {checkArtworkImage} = require("../../helpers/artworkImageEndpointHelpers.js");

test('check image', () =>{
    //check for empty input
    expect(checkArtworkImage("")).toBe(false);
    //check for a null input
    expect(checkArtworkImage(null)).toBe(false);
    //check for a short name
    expect(checkArtworkImage("i")).toBe(false);
    //check for a numeric name
    expect(checkArtworkImage(1)).toBe(false);
    expect(checkArtworkImage(false)).toBe(false);
    expect(checkArtworkImage(undefined)).toBe(false);
    //check for an invalid url
    expect(checkArtworkImage("invalid-url")).toBe(false);
    
    expect(checkArtworkImage("https://example.com/starry-night.jpg")).toBe(true);
    expect(checkArtworkImage("https://example.com/mona-lisa.jpg")).toBe(true);

})

// Additional test for an edge case (e.g., maximum length)
test('check maximum length image URL', () => {
    // Assuming a maximum length of 255 characters (for example purposes)
    const longUrl = "https://example.com/" + "a".repeat(250) + ".jpg";
    expect(checkArtworkImage(longUrl)).toBe(false);
});

