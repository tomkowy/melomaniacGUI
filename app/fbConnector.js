//inicjalizacja Facebook SDK, koniecznie jako pierwsza wywoływana funkcja w dokumencie
function fbInit(callback) {
    window.fbAsyncInit = function() {
        FB.init({
            appId: '798879713594636',
            xfbml: true,
            cookie: true,
            session: true,
            version: 'v2.8'
        });

        if (callback) { callback(); }
        FB.AppEvents.logPageView();

    };

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "http://connect.facebook.net/en_US/sdk/debug.js"; //lub connect.facebook.net/en_US/sdk.js dla wersji produkcyjnej
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}


function fbLoginStatus(callback) { //w argumencie callbacka zwraca status zalogowania ('connected' jeśli zalogowany)
    FB.getLoginStatus(function(response) {
        callback(response.status);
    });
}

function fbRefreshSession(callback) {
    fbLoginStatus(function(status) {
        if (status === 'connected') {
            callback();
        } else {
            fbLogin(callback);
        }
    });
}


function fbLogin(callback) {
    console.log("Logowanie do fb...")
    FB.login(function(response) {
        if (response.status === 'connected') {
            console.log("Zalogowano.")
            callback();
        }
    }, { scope: 'public_profile,user_likes,user_friends,user_actions.music,publish_actions' });
}

function fbLogout(callback) {
    fbLoginStatus(function(status) {
        if (status === 'connected') {
            FB.logout(function(response) {
                callback();
            });
        }

    });
}

function getName(callback) { //w argumencie dla callbacka zwraca nazwę zalogowanego użytkownika
    fbRefreshSession(function() {
        FB.api(
            '/me',
            'GET', { "fields": "name" },
            function(response) {
                callback(response.name);
            }
        );
    });

}

function getPictureUrl(callback) { //w argumencie dla callbacka zwraca url zdjęcia profilowego
    fbRefreshSession(function() {
        FB.api(
            '/me/picture',
            'GET', {},
            function(response) {
                callback(response.data.url);
            }
        );
    });
}


function getFriends(callback) { //w argumencie dla callbacka zwraca listę znajomych którzy korzystają z tej aplikacji (w sensie zalogowali się kiedyś)
    FB.api( //lista elementów {id, nazwa użytkownika}
        '/me/friends',
        'GET', {},
        function(response) {
            callback(response.data)
        }
    );
}


function getArtists(limit, callback) { //w argumencie dla callbacka zwraca listę muzyków
    fbRefreshSession(function() {
        FB.api(
            '/me',
            'GET', { "fields": "music.limit(" + limit + ")" }, //[limit] obiektów na stronę
            function(response) {
                var artists = [];
                if (response.music) {
                    response.music.data.forEach(function(element, index) {
                        artists.push(element.name);
                    });
                }
                callback(artists);
            }
        );
    });
}

function fbPublish(text, callback) {
    fbRefreshSession(function() {
        FB.api('/me/feed',
            'POST', { message: text },
            function(response) {
                if (!response || response.error) {
                    alert("Wystąpił błąd podczas publikowania");
                } else callback();
            });
    });
}
