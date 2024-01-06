const{checkArtworkTitle} = require("../../helpers/artworkEndpointHelpers.js")
 
test("check title", () => {
    //check for empty input
    expect(checkArtworkTitle("")).toBe(false);
    //check for a null input
    expect(checkArtworkTitle(null)).toBe(false);
    //check for a short name
    expect(checkArtworkTitle("i")).toBe(false);
    //check for a numeric name
    expect(checkArtworkTitle(1)).toBe(false);
    //check for an insane long name
    expect(checkArtworkTitle("pijdbzkjbepjsbdmbupicvbdpijdbphxkjcvLMDIhcxmlknvcmkmkjvbmkj")).toBe(false);

    expect(checkArtworkTitle("mona lisa")).toBe(true);
    expect(checkArtworkTitle("flower")).toBe(true);
} )