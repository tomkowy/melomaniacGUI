$(document).ready(function() {
    if (document.title.indexOf("starting page") > 0) {
        alert('e-handluj z tym');
        initFbAndRedirect();
    } else if (window.location.href.indexOf("main") > 0) {
        fbInit(function() {
            setUsernameAndPicture();
        });
    } else {
        fbInit();
    }

});

function initFbAndRedirect() {
    fbInit(function() {
        fbLoginStatus(function(status) {
            if (status === 'connected') {
                window.location.href = "/html/main.html";
            } else {
                window.location.href = "/html/sign-in.html";
            }
        });
    });
}

function loginAndRedirect() {
    fbLogin(function() {
        window.location.href = "/html/main.html";
    });
}

function setUsernameAndPicture() {
    getName(function(name) {
        $("#username").text(name);
    });

    getPictureUrl(function(url) {
        $("#picture").html("<img src='"+url+"' />");
    });
}

function showArtists() {
    getArtists(100, function(artists){
        alert("Banda pedałów których słuchasz: \n" + artists);
    });
}

function showFriends() {
    getFriends(function(friends) {
        var friendsNames = [];
        friends.forEach( function(element, index) {
            friendsNames.push(element.name);
        });
            alert("Frajerzy których znasz korzystający z naszej zajebistej apki: \n" +friendsNames);
    });
}

function publishOnFb() {
    text = prompt("Pochwal się jakie genialne gówno znalazłeś dzięki naszej stronce");
    fbPublish(text);
}


function logoutAndRedirect() {
    fbLogout(function() {
        window.location = "/html/sign-in.html";
    });
}
