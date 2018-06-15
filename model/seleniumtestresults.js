const SeleniumTestCaseResult = require('./seleniumtestcaseresult.js')

module.exports = class SeleniumTestResults {
  constructor(browserInfo, testRunData) {
    var assemblySuites = testRunData['test-run']['test-suite'];
    for (var i = 0; i < assemblySuites.length; i++) {
      var testSuiteSummary = assemblySuites[i];
      if (testSuiteSummary['@name'] == 'WebDriver.Common.Tests.dll') {
        this.description = browserInfo['description'];
        this.browser = browserInfo['browser'];
        this.driver = browserInfo['driver'];
        this.total = testSuiteSummary['@testcasecount'];
        this.passed = testSuiteSummary['@passed'];
        this.failed = testSuiteSummary['@failed'];
        this.skipped = testSuiteSummary['@skipped'];
        this.duration = (testSuiteSummary['@duration'] * 1).toFixed(3);
        this.passrate = (this.passed / (this.total - this.skipped) * 100).toFixed(2);

        function processTestResults(run) {
          var resultArray = [];
          for (var i = 0; i < run.length; i++) {
            var testClass = run[i];
            var testClassType = testClass['@type'];
            if (testClassType == 'TestFixture') {
              var count = parseInt(testClass['@testcasecount']);
              if (count == 1) {
                var testCase = testClass['test-case'];
                resultArray.push(new SeleniumTestCaseResult(testCase));
              } else {
                var testMethods = testClass['test-case'];
                for (var j = 0; j < testMethods.length; j++) {
                  resultArray.push(new SeleniumTestCaseResult(testMethods[j]));
                }
              }
            } else if (testClassType == 'TestSuite') {
              var interimArray = processTestResults(testClass['test-suite']);
              Array.prototype.push.apply(resultArray, interimArray);
            }
          }
          return resultArray;
        };

        var run = testSuiteSummary['test-suite']['test-suite']['test-suite'];
        this.tests = processTestResults(run);
      }
    }
  }
};