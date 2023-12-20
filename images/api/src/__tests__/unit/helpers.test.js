const{checkArtworkTitle} = require("../../helpers/endpointHelpers.js")

// table.increments('id').primary();
// table.string('title')/* .notNullable() */;
// table.string('artist_uuid')/* .notNullable() */;
// table.string('image_url')/* .notNullable() */;
// table.string('location_geohash').notNullable();
 
test("check title", () => {

    expect(checkArtworkTitle("")).toBe(false);
    expect(checkArtworkTitle(null)).toBe(false);
    expect(checkArtworkTitle("i")).toBe(false);
    expect(checkArtworkTitle(1)).toBe(false);
    expect(checkArtworkTitle("pijdbzkjbepjsbdmbupicvbdpijdbphxkjcvLMDIhcxmlknvcmkmkjvbmkj")).toBe(false);

    expect(checkArtworkTitle("mona lisa")).toBe(true);
    expect(checkArtworkTitle("flower")).toBe(true);
} )