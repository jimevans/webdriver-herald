module.exports = class TestResultsCrosstab {
  constructor(allTestResults) {
    this.browsers = [];
    this.tests = {};
    for (var browserType in allTestResults) {
      var results = allTestResults[browserType];
      this.browsers.push(results.description);
      for (var i = 0; i < results.tests.length; i++) {
        var testFullName = results.tests[i].fullname;
        if (!this.tests.hasOwnProperty(testFullName)) {
          // Make the 'results' property a Map, since the properties
          // are guaranteed to be iterated in insertion order.
          this.tests[testFullName] = {
            'shortName': testFullName.replace('OpenQA.Selenium.', ''),
            'results': new Map()
          };
        }
        var browser_test_result = {
          'status': results.tests[i].status,
          'reason': results.tests[i].reason
        };
        this.tests[testFullName].results[results.description] = browser_test_result;
      }
    }
  }
};