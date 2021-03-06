/*
Usage example:

document.backend.commentService.getAllForTrack(123,
    function (data, textStatus, xhr) {
        //This is success handler - do whatever you want width obtained data.
        console.log("Success", data, textStatus, xhr);
    },
    function (data, textStatus, xhr) {
        //This is failure handler - runs when your request was not served correctly (wrong input data/server error).
        console.log("Failed", data, textStatus, xhr);
    }
);

*/

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


(function () {
    "use strict";
    /*global
        document, this, $, console
    */
    function BackEndConnector(backendUrl) {
        this.url = backendUrl;

        var sendAjax = function (controller, method, type, data, onSuccess, onFail) {
            $.ajax({
                "url": backendUrl + '/api/' + controller + '/' + method,
                type: type,
                dataType: 'json',
                data: typeof data.data === "object" ? data.data : data,
                success: function (data, textStatus, xhr) {
                    if (onSuccess) {
                        if (typeof data === 'string') {
                            //data = data.slice(1, -1);
                            data = data.replaceAll('\'', '"');
                            data = JSON.parse(data);
                        }

                        onSuccess(data, textStatus, xhr);
                    } else {
                        console.log('Success - ajax request has been sent, add function(data, textStatus, xhr) as second parameter to handle data.');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (onFail) {
                        onFail(data, textStatus, xhr);
                    } else {
                        console.log('Fail - ajax request has not been sent, add function(data, textStatus, xhr) as third parameter to handle error data.');
                    }
                }
            });
        };

        //Used for comments
        //first argument is data which you need to post, kind of object or, just id, 
        //other two are success and failure handlers.
        this.commentService = {
            "controllerName": "Comments",
            "getAllForTrack": function (id, onSuccess, onFail) {
                sendAjax(this.controllerName, "GetAllTrackComments", "GET", {
                    data: id
                }, onSuccess, onFail);
            },
            "getUserComments": function (userFbId, onSuccess, onFail) {
                sendAjax(this.controllerName, "GetUserComments", "GET", {
                    data: userFbId
                }, onSuccess, onFail);
            },
            "edit": function (comment, onSuccess, onFail) {
                sendAjax(this.controllerName, "EditComment", "POST", {
                    data: comment
                }, onSuccess, onFail);
            },
            "remove": function (id, onSuccess, onFail) {
                sendAjax(this.controllerName, "DeleteComment", "POST", {
                    data: id
                }, onSuccess, onFail);
            },
            "post": function (comment, onSuccess, onFail) {
                sendAjax(this.controllerName, "PostComment", "POST", {
                    data: comment
                }, onSuccess, onFail);
            }
        };

        //Used for ratings
        //first argument is data which you need to post, kind of object or, just id, 
        //other two are success and failure handlers.
        this.rateService = {
            "controllerName": "Rates",
            "GetAllForTrack": function (id, onSuccess, onFail) {
                sendAjax(this.controllerName, "GetAllTrackRates", "GET", {
                    data: id
                }, onSuccess, onFail);
            },
            "GetTrackAverageRate": function (id, onSuccess, onFail) {
                sendAjax(this.controllerName, "GetTrackAverageRate", "GET", {
                    data: id
                }, onSuccess, onFail);
            },
            "edit": function (rate, onSuccess, onFail) {
                sendAjax(this.controllerName, "EditRate", "POST", {
                    data: rate
                }, onSuccess, onFail);
            },
            "remove": function (id, onSuccess, onFail) {
                sendAjax(this.controllerName, "DeleteRate", "POST", {
                    data: id
                }, onSuccess, onFail);
            },
            "post": function (rate, onSuccess, onFail) {
                sendAjax(this.controllerName, "PostRate", "POST", {
                    data: rate
                }, onSuccess, onFail);
            }
        };
    }

    document.backend = new BackEndConnector("http://melomaniac.azurewebsites.net");

}());
