function scInit() {
    SC.initialize({
        client_id: '342b8a7af638944906dcdb46f9d56d98'
    });
}

function getTracksOfArtists(limit, artists) {
    var allTracks = [];
    for(var i=0; i<artists.length; i++) {
        SC.get('/tracks', {
            q: artists[i],
            limit: limit
        }).then(function(tracks){
            for(var j=0; j<tracks.length; j++) {
                allTracks.push(tracks[j]);
            }
        });
    }
    return allTracks;
}

function generateSoundWrapper(url) {
    SC.oEmbed(url, { auto_play: false }).then(function(oEmbed) {
        console.log('oEmbed response: ', oEmbed);
    });
}