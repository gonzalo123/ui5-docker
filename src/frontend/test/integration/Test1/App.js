sap.ui.require([
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/PropertyStrictEquals"
  ],
  function (Opa5, opaTest, Press, PropertyStrictEquals) {
    QUnit.module("gonzalo123 simple test example", {
      beforeEach: function () {
        "use strict";
      },
      afterEach: function () {
        "use strict";
        var clock = sinon.useFakeTimers();

        new sap.ui.test.Opa5().iTeardownMyUIComponent();
        sap.ui.test.Opa.emptyQueue();
        clock.tick(1000);
        clock.restore();
      }
    });

    var arrangements = new Opa5({
      iStartMyApp: function (url) {
        return this.iStartMyAppInAFrame(url);
      }
    });

    var actions = new Opa5({
      iClickOnGET: function () {
        return this.waitFor({
          viewName: 'App',
          id: 'GET',
          actions: new Press(),
          success: function () {
            Opa5.assert.ok(true, "The GET item has been pressed");
          },
          errorMessage: "Did not find element: GET"
        });
      },
      iClickOnPOST: function () {
        return this.waitFor({
          viewName: 'App',
          id: 'POST',
          actions: new Press(),
          success: function () {
            Opa5.assert.ok(true, "The POST item has been pressed");
          },
          errorMessage: "Did not find element: POST"
        });
      }
    });

    var assertions = new Opa5({
      getCounterShouldBeIncrementedByOne: function (cbk) {
        return this.waitFor({
          viewName: "App",
          id: "getCount",
          matchers: new PropertyStrictEquals({
            name: "text",
            value: "1"
          }),
          success: function () {
            Opa5.assert.ok(true, "The GET element has been incremented by one");
          },
          errorMessage: "Did not find the getCount"
        });
      },
      postCounterShouldBeIncrementedByOne: function (cbk) {
        return this.waitFor({
          viewName: "App",
          id: "postCount",
          matchers: new PropertyStrictEquals({
            name: "text",
            value: "1"
          }),
          success: function () {
            Opa5.assert.ok(true, "The POST element has been incremented by one");
          },
          errorMessage: "Did not find the postCount"
        });
      }
    });

    Opa5.extendConfig({
      viewNamespace: "gonzalo123.view.",
      arrangements: arrangements,
      actions: actions,
      assertions: assertions,
      autoWait: false
    });

    opaTest("When I click on GET the GET counter should increment by one", function (Given, When, Then) {
      Given.iStartMyApp("./integration/Test1/index.html");
      When.iClickOnGET();
      Then.getCounterShouldBeIncrementedByOne().and.iTeardownMyAppFrame();
    });

    opaTest("When I click on POST the POST counter should increment by one", function (Given, When, Then) {
      Given.iStartMyApp("./integration/Test1/index.html");
      When.iClickOnPOST();
      Then.postCounterShouldBeIncrementedByOne().and.iTeardownMyAppFrame();
    });

    QUnit.start();
  });
