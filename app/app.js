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
            var id = window.location.href.split('?id=track_')[1]
            getTrackDetails(id);
        });

    } else {
        fbInit(function () {
            setUsernameAndPicture();
        });
    }
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
        alert("Banda pedałów których słuchasz: \n" + artists);
    });
}

function showFriends() {
    getFriends(function (friends) {
        var friendsNames = [];
        friends.forEach(function (element, index) {
            friendsNames.push(element.name);
        });
        alert("Frajerzy których znasz korzystający z naszej zajebistej apki: \n" + friendsNames);
    });
}

function publishOnFb() {
    text = prompt("Pochwal się jakie genialne gówno znalazłeś dzięki naszej stronce");
    fbPublish(text);
}


function logoutAndRedirect() {
    fbLogout(function () {
        window.location = "/html/sign-in.html";
    });
}

// ----------------  main.html ---------------

function showMusicSuggestions() {
    getArtists(100, function (artists) {
        artists.forEach(function (artist, i) {
            getTracksOfArtist(2, artist, function (tracks) {
                tracks.forEach(function (track, j) {
                    var suggestionDiv =
                        '<div class="row" id="track_' + track.id + '">' +
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
    });
}

// ----------------  track-details.html ---------------
function getTrackDetails(id) {
    getTrack(id, function (data) {
        console.log(data);
    });
}