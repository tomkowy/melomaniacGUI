
function createRequest(yqls) {
    return function () {
        return $.getJSON(yqls, function (data) {

        })
    }
}

function changeXmlResponseOnJson(data) {
    var jsonProducts = [];
    var xmlProducts = $(data[0].results[0]).find("product");

    for (var i = 0; i < xmlProducts.length; i++) {
        var price = $(xmlProducts[i]).children("price")[0].childNodes[0].nodeValue.replace('[CDATA[', '').replace(']]', '');
        var url = $(xmlProducts[i]).children("meta_description")[0].childNodes[0].childNodes[0].nodeValue.replace('[CDATA[', '').replace(']]', '');
        
        jsonProducts.push({ price: parseFloat(price), url: url + '?sklepik' })
    }

    return jsonProducts;
}

function showBuyButtons(products) {
    products.forEach(function (track, j) {
        if (track.price && track.url) {
            var buyButtons =
                '<div class="col-sm-4">' +
                '<a href="' + track.url + '"' + 'class="btn btn-primary btn-sm"">' + track.price + ' zł</a>' +
                '</div>';

            $("#buy_buttons").append(buyButtons);
            setTimeout(function () {
                $('#track_' + track.id).click(function () {
                    window.location.href = window.location.href.replace(trackId, track.id);
                });
            }, 1000);
        }
    });
}

function getProducts(trackId) {
    var schopsUrls = [
        'http://testowysklep3.cba.pl/api/products?filter[meta_title]=' + trackId + '&display=[id,price,meta_description]&sort=price_ASC&limit=3&ws_key=FL4R8YPU9SWA2CWW8HY75ANPNDAYJATR',
        'http://testowysklep3.cba.pl/api/products?filter[meta_title]=' + trackId + '&display=[id,price,meta_description]&sort=price_ASC&limit=3&ws_key=FL4R8YPU9SWA2CWW8HY75ANPNDAYJATR'
    ];
    var yqls = [
        'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + schopsUrls[0] + '"') + '&format=xml&callback=?',
        'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + schopsUrls[1] + '"') + '&format=xml&callback=?'
    ];

    var request1 = createRequest(yqls[0]);
    var request2 = createRequest(yqls[1]);

    var allJsonProducts = [];

    $.when(request1(), request2()).done(function (data1, data2) {
        var firstSchopData = changeXmlResponseOnJson(data1);
        var secondSchopData = changeXmlResponseOnJson(data2);

        allJsonProducts = $.merge(firstSchopData, secondSchopData);

        var sortData = allJsonProducts.sort(function (a, b) { return a.price > b.price })
        var threeFirst = sortData.slice(0, 3);

        showBuyButtons(threeFirst);
    });
}