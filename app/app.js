$(document).ready(function () {
    if (document.title.indexOf("starting page") > 0) {
        alert('e-handluj z tym');
        initFbAndRedirect();
    } else if (window.location.href.indexOf("main") > 0) {
        fbInit(function () {
            setUsernameAndPicture();
            scInit();
            showMusicSuggestions();
        });
    } else if (window.location.href.indexOf("track-details") > 0) {
        fbInit(function () {
            setUsernameAndPicture();
            scInit();
            var id = window.location.href.split('?id=track_')[1];
            document.trackId = id;
            getTrackDetails(id);
            trackDetailsController(id);
            showTrackDetailsFromSC(id);
            showSimilarTracks(id);
        });
    } else if (window.location.href.indexOf("search-track") > 0) {
        fbInit(function () {
            setUsernameAndPicture();
            scInit();
            showListOfSearchingResults();
        });
    } else {
        fbInit(function () {
            setUsernameAndPicture();
        });
    }
    
    initSearchInput();
});

function initFbAndRedirect() {
    fbInit(function () {
        fbLoginStatus(function (status) {
            if (status === 'connected') {
                window.location.href = "/html/main.html";
            } else {
                window.location.href = "/html/sign-in.html";
            }
        });
    });
}

function loginAndRedirect() {
    fbLogin(function () {
        window.location.href = "/html/main.html";
    });
}

function setUsernameAndPicture() {
    getName(function (name) {
        $("#username").text(name);
    });

    getPictureUrl(function (url) {
        $("#picture").html("<img src='" + url + "' />");
    });
}

function showArtists() {
    getArtists(100, function (artists) {
        alert("Artyści których słuchasz: \n" + artists);
    });
}

function showFriends() {
    getFriends(function (friends) {
        var friendsNames = [];
        friends.forEach(function (element, index) {
            friendsNames.push(element.name);
        });
        alert("Twoi znajomi korzystający z naszej aplikacji: \n" + friendsNames);
    });
}

function publishOnFb() {
    text = prompt("Pochwal się znaleziskiem:");
    if (!text) {return;}
    fbPublish(text);
}


function logoutAndRedirect() {
    fbLogout(function () {
        window.location = "/html/sign-in.html";
    });
}

// -------------  search input ---------------

function initSearchInput() {
    $("#searchInput").on('keyup', function(e) {
        if(e.keyCode == '13') {
            var param = "?phrase=" + $(this).val();
            window.location.href = "/html/search-track.html" + param;
        }
    })
}

// ----------------  main.html ---------------

function showMusicSuggestions() {
    getArtists(100, function (artists) {
        artists.forEach(function (artist, i) {
            getTracksOfArtist(2, artist, function (tracks) {
                tracks.forEach(function (track, j) {
                    var suggestionDiv =
                        '<div class="row cursor_pointer" id="track_' + track.id + '">' +
                        '<div class="col-xs-4">' +
                        '<img width="200" height="200" src="' + track.artwork_url + '" />' +
                        '</div>' +
                        '<div class="col-xs-8">' +
                        '<div class="col-xs-12">Artysta: ' + track.user.username + '</div>' +
                        '<div class="col-xs-12">Utwór: ' + track.title + '</div>' +
                        '<div class="col-xs-12">Gatunek: ' + track.genre + '</div>' +
                        '<div class="col-xs-12">Data utworzenia: ' + track.created_at + '</div>' +
                        '</div>' +
                        '</div>';
                    $("#suggestions_container").append(suggestionDiv);
                    setTimeout(function () {
                        $('#track_' + track.id).click(function (e) {
                            var id = e.currentTarget.id;
                            window.location.href = window.location.href.replace('main.html', '') + 'track-details.html?id=' + id;
                        });
                    }, 1000);
                })
            })
        })
    })
}

// ----------------  track-details.html ---------------
function getTrackDetails(id) {
    getTrack(id, function (data) {
        console.log(data);
    });

    document.backend.commentService.getAllForTrack(id, function (data) {
        updateComments();
        updateRates();
    }, function (data) {});

    document.backend.rateService.GetAllForTrack(id, function (data) {
        console.log("ratings", data);
    }, function () {});

    document.backend.rateService.GetTrackAverageRate(id, function (data) {
        console.log("averageRate", data);
        $('#rateCount').html(data.numberOfElements);
        $('#rateAvg').html(data.avg);
    }, function () {});

}

function trackDetailsController(id) {
    $(document).ready(function () {
        $('#publish').click(function () {

            getId(function (fbid) {
                var newComment = {
                    fb: fbid,
                    soundcloud: id,
                    content: $('#newComment').val(),
                    date: (new Date()).toISOString(),
                };

                document.backend.commentService.post(newComment, function () {
                    $('#newComment').val('');
                    updateComments();
                }, function () {});

            })


        });

        $('#rateSelect').change(function (s) {
            var rateValue = $("#rateSelect option:selected").text();
            getId(function (fbid) {

                var rate = {
                    fb: fbid,
                    soundcloud: document.trackId,
                    mark: parseInt(rateValue),
                    date: (new Date()).toISOString(),
                }

                document.backend.rateService.post(rate, function (data) {
                    updateRates();
                }, function (e) {});
            });
        });
    });
}

function updateComments() {
    document.backend.commentService.getAllForTrack(document.trackId, function (data) {
        $('#comments-container').html('');

        for (var i = 0; i < data.length; i++) {
            if (data[i].fb) {
                var callback = function (userData, commentData) {
                    var content = '<div class="row"><div class="col-sm-3">' +
                        '<img src="' + userData.picture.data.url + '"> </div> <div class="col-sm-9" >' +
                        '<div class="row"> <b>' + userData.name + '</b></div >' +
                        '<div class="row"> <p style="font-size: small" >' + commentData.content +
                        '</p> </div> </div> </div>';
                    var old = $('#comments-container').html();
                    $('#comments-container').html(old + content);
                }
                getUserById(data[i].fb, callback, data[i]);
            }
        }
    });
}


function updateRates() {
    document.backend.rateService.GetAllForTrack(document.trackId, function (data) {
        $('#rate-container').html('');

        for (var i = 0; i < data.length; i++) {
            if (data[i].fb) {
                var callback = function (userData, rateData) {
                    var content = '<div class="row"><div class="col-sm-3">' +
                        '<img src="' + userData.picture.data.url + '"> </div> <div class="col-sm-9" >' +
                        '<div class="row"> <b>' + userData.name + '</b></div >' +
                        '<div class="row"> <p style="font-size: small" >' + rateData.mark +
                        '</p> </div> </div> </div>';
                    var old = $('#rate-container').html();
                    $('#rate-container').html(old + content);
                }
                getUserById(data[i].fb, callback, data[i]);
            }
        }
    });
}

function showTrackDetailsFromSC(id) {
    getTrack(id, function(track) {
        $("#artwork").append('<img width="200" height="200" src="' + track.artwork_url + '" />');
        $("#track_info").append('<div class="row">' +
            '<div class="col-xs-12">Gatunek: ' + track.genre + '</div>' +
            '<div class="col-xs-12">Data utworzenia: ' + track.created_at + 
            '</div>');
        generateSoundWrapper(track.permalink_url, function(wrapper){
            $("#soundWrapper").append(wrapper.html); 
        });
    });
}

function showSimilarTracks(trackId) {
    getTrack(trackId, function(track) {
        var artist = track.user.username;
        getTracksOfArtist(11, artist, function(tracks) {
            tracks.forEach(function (track, j) {
                if(track.id != trackId) {
                    var similarDiv = '<div class="row cursor_pointer" id="track_' + track.id + '">' +
                        '<div class="col-sm-4">' +
                        '<img width="80" height="80" src="' + track.artwork_url + '" />' +
                        '</div>' +
                        '<div class="col-sm-8">' +
                        '<div class="row similar_description">' +
                        '<div class="col-sm-12">Artysta: ' + track.user.username + '</div>' +
                        '<div class="col-sm-12">Utwór: ' + track.title + '</div>' +
                        '<div class="col-sm-12">Gatunek: ' + track.genre + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                   $("#similar_tracks").append(similarDiv);
                   setTimeout(function() {
                        $('#track_' + track.id).click(function () {
                            window.location.href = window.location.href.replace(trackId, track.id);
                        });
                   }, 1000);
                }
            });
        });
    });
}

// ----------------  search-track.html ---------------

function showListOfSearchingResults() {
    var phrase = window.location.href.split('?phrase=')[1];
    $("#searching_header").append('"' + phrase + '"');
    getTracksByPhrase(phrase, 10, function(tracks) {
        console.log(tracks.length);
        tracks.forEach(function (track, j) {
            var searchResultsDiv =
                '<div class="row cursor_pointer search_result" id="track_' + track.id + '">' +
                '<div class="col-xs-4">' +
                '<img width="200" height="200" src="' + track.artwork_url + '" />' +
                '</div>' +
                '<div class="col-xs-8 track_description">' +
                '<div class="col-xs-12">Artysta: ' + track.user.username + '</div>' +
                '<div class="col-xs-12">Utwór: ' + track.title + '</div>' +
                '<div class="col-xs-12">Gatunek: ' + track.genre + '</div>' +
                '<div class="col-xs-12">Data utworzenia: ' + track.created_at + '</div>' +
                '</div>' +
                '</div>';
            $("#searching_container").append(searchResultsDiv);
            setTimeout(function () {
                $('#track_' + track.id).click(function (e) {
                    var id = e.currentTarget.id;
                    window.location.href = window.location.href.split('search-track.html')[0] + 'track-details.html?id=' + id;
                });
            }, 1000);
        })
    })
}