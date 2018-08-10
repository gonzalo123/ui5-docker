sap.ui.define(["sap/ui/thirdparty/sinon"],
  function (sinon) {
    "use strict";

    return {
      initServer: function (match) {
        var server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.autoRespondAfter = 1000;

        sinon.fakeServer.xhr.useFilters = true;
        server.xhr.addFilter(function (method, url) {
          return !url.match(match);
        });

        return server;
      }
    };
  }
);

