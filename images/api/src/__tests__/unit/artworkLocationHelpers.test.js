const { checkArtworkLocation } = require("../../helpers/artworkEndpointHelpers");

// Test for a specific case (e.g., valid)
test('check valid location geohash', () => {
    //check for a short name
    expect(checkArtworkLocation("a")).toBe(false);
    //check for empty input
    expect(checkArtworkLocation("")).toBe(false);
    //check for a null input
    expect(checkArtworkLocation(null)).toBe(false);
    //check for a numeric name
    expect(checkArtworkLocation(1)).toBe(false);
    expect(checkArtworkLocation(false)).toBe(false);
    expect(checkArtworkLocation(undefined)).toBe(false);

});

test('check geohash with capital letters', ()=>{
    expect(checkArtworkLocation("u4pRuyDqqVj")).toBe(false);
})

test('check valid location geohash', ()=>{
    expect(checkArtworkLocation("u4pruydqqvj")).toBe(true);
})

// Test for invalid location geohash (no protocol)
test('check invalid location geohash (no protocol)', () => {
    const invalidGeohash = "invalid-location";
    expect(checkArtworkLocation(invalidGeohash)).toBe(false);
});

// Test for an edge case (e.g., maximum length)
test('check maximum length location geohash', () => {
    const longGeohash = "a".repeat(21);
    expect(checkArtworkLocation(longGeohash)).toBe(false);
});

