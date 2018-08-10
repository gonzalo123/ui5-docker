sap.ui.define(
  ["test/server"],
  function (server) {
    "use strict";

    return {
      init: function () {
        var oServer = server.initServer("/backend/api");

        oServer.respondWith("GET", /backend\/api/, [200, {
          "Content-Type": "application/json"
        }, JSON.stringify({
          "date": "2018-07-29T18:44:57+02:00"
        })]);

        oServer.respondWith("POST", /backend\/api/, [200, {
          "Content-Type": "application/json"
        }, JSON.stringify({
          "date": "2018-07-29T18:44:57+02:00"
        })]);
      }
    };
  }
);
