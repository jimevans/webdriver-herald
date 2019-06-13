const SeleniumTestCaseResult = require('./seleniumtestcaseresult.js')

module.exports = class SeleniumTestResults {
  constructor(browserInfo, testRunData) {
    function processTestResults(run) {
      var resultArray = [];
      for (var i = 0; i < run.length; i++) {
        var testClass = run[i];
        var testClassType = testClass['@type'];
        if (testClassType === 'TestFixture') {
          var count = parseInt(testClass['@testcasecount']);
          if (count === 1) {
            var testCase = testClass['test-case'];
            resultArray.push(new SeleniumTestCaseResult(testCase));
          } else {
            var testMethods = testClass['test-case'];
            if (testMethods) {
              for (var j = 0; j < testMethods.length; j++) {
                resultArray.push(new SeleniumTestCaseResult(testMethods[j]));
              }
            }
          }
        } else if (testClassType === 'TestSuite') {
          var interimArray = processTestResults(testClass['test-suite']);
          Array.prototype.push.apply(resultArray, interimArray);
        }
      }
      return resultArray;
    }

    function processBazelTestResults(run) {
      var resultArray = [];
      var testSuites = testRun['testsuite'];
      for (var testSuiteIndex = 0; testSuiteIndex < testSuites.length; testSuiteIndex++) {
        var testSuite = testSuites[testSuiteIndex];
        var testCases = testSuite['testcase'];
        for (var testCaseIndex = 0; testCaseIndex < testCases.length; testCaseIndex++) {
          var testCase = testCases[testCaseIndex];
          resultArray.push(new SeleniumTestCaseResult(testCase));
        }
      }
      return resultArray;
    }

    this.description = browserInfo['description'];
    this.browser = browserInfo['browser'];
    this.driver = browserInfo['driver'];
    if (testRunData['test-run']) {
      var assemblySuites = testRunData['test-run']['test-suite'];
      for (var i = 0; i < assemblySuites.length; i++) {
        var testSuiteSummary = assemblySuites[i];
        if (testSuiteSummary['@name'] === 'WebDriver.Common.Tests.dll') {
          this.total = testSuiteSummary['@testcasecount'];
          this.passed = testSuiteSummary['@passed'];
          this.failed = testSuiteSummary['@failed'];
          this.skipped = testSuiteSummary['@skipped'];
          this.duration = (testSuiteSummary['@duration'] * 1).toFixed(3);
          this.passrate = (this.passed / (this.total - this.skipped) * 100).toFixed(2);

          var run = testSuiteSummary['test-suite']['test-suite']['test-suite'];
          this.tests = processTestResults(run);
        }
      }
    } else {
      var testRun = testRunData['testsuites'];
      this.total = parseInt(testRun['@tests']);
      this.failed = parseInt(testRun['@failures']);
      this.skipped = parseInt(testRun['@disabled']);
      this.duration = (testRun['@time'] * 1).toFixed(3);
      this.passed = this.total - (this.failed + this.skipped);
      this.passrate = (this.passed / (this.total - this.skipped) * 100).toFixed(2);
      var testSuites = testRun['testsuite'];
      this.tests = processBazelTestResults(testSuites);
    }
  }
};