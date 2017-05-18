var CLIENT_ID = '342b8a7af638944906dcdb46f9d56d98';

// Metoda scInit musi byc wywolana na starcie kazdego widoku (autoryzacja)
function scInit() {
    SC.initialize({
        client_id: CLIENT_ID
    });
}

function getTrack(trackId, callback) {
    var successHandler = function(response) {
        callback(response[0]);
    }

    SC.get('/tracks', {
        ids: trackId
    }).then(successHandler);
}

function getTracksOfArtist(limit, artist, callback) {
    var successHandler = function(tracks) {
        callback(tracks);
    }

    SC.get('/tracks', {
        q: artist,
        limit: limit
    }).then(successHandler);
}

function generateSoundWrapper(url, callback) {
    var successHandler = function(oEmbed) {
        callback(oEmbed);
    }

    SC.oEmbed(url + '&client_id=' + CLIENT_ID, {
        max_height: 200,
        auto_play: true
    }).then(successHandler);
}

function getTracksByPhrase(phrase, limit, callback) {
    var successHandler = function(tracks) {
        callback(tracks);
    }
    
    SC.get('/tracks', {
        q: phrase,
        limit: limit
    }).then(successHandler);
}