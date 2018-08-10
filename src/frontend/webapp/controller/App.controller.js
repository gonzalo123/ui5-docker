sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  'sap/m/MessageToast',
  "gonzalo123/model/api"
], function (Controller, JSONModel, MessageToast, api) {
  "use strict";

  return Controller.extend("gonzalo123.controller.App", {
    model: new JSONModel({
      Data: {get: {count: 0}, post: {count: 0}}
    }),

    onInit: function () {
      this.getView().setModel(this.model);
    },

    getPressHandle: function () {
      api.get("/", {}).then(function (data) {
        var count = this.model.getProperty('/Data/get/count');
        MessageToast.show("Pressed : " + data.date);
        this.model.setProperty('/Data/get/count', ++count);
      }.bind(this));
    },

    postPressHandle: function () {
      var count = this.model.getProperty('/Data/post/count');
      api.post("/", {}).then(function (data) {
        MessageToast.show("Pressed : " + data.date);
        this.model.setProperty('/Data/post/count', ++count);
      }.bind(this));
    }
  });
});
