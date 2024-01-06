const{checkArtistName} = require("../../helpers/artistEndpointHelpers.js")

test("check name", () => {
    //check for empty input
    expect(checkArtistName("")).toBe(false);
    //check for a null input
    expect(checkArtistName(null)).toBe(false);
    //check for a short name
    expect(checkArtistName("i")).toBe(false);
    //check for a numeric name
    expect(checkArtistName(1)).toBe(false);
    //check for a number in string
    expect(checkArtistName("1")).toBe(false);
    expect(checkArtistName(false)).toBe(false);
    expect(checkArtistName(undefined)).toBe(false);
    //check for an insane long name
    expect(checkArtistName("pijdbzkjbepjsbdmbupicvbdpijdbphxkjcvLMDIhcxmlknvcmkmkjvbmkj")).toBe(false);
    //check for invalid characters
    expect(checkArtistName("Bobby@")).toBe(false);


    expect(checkArtistName("Leonardo da Vinci")).toBe(true);
    expect(checkArtistName("flower")).toBe(true);
})