const WptTestCaseResult = require('./wpttestcaseresult.js')

module.exports = class WptTestResults {
  constructor(browserInfo, testRunData) {
    this.description = browserInfo['description'];
    this.browser = browserInfo['browser'];
    this.driver = browserInfo['driver'];
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.duration = ((testRunData['time_end'] - testRunData['time_start']) / 1000).toFixed(3);
    this.tests = [];
    var testFileResults = testRunData['results'];
    for (var i = 0; i < testFileResults.length; i++) {
      var fileName = testFileResults[i]['test'];
      var testFileSubTestResults = testFileResults[i]['subtests'];
      for (var j = 0; j < testFileSubTestResults.length; j++) {
        var subtestResult = new WptTestCaseResult(fileName, testFileSubTestResults[j]);
        if (subtestResult.status != 'error') {
          this.total += 1;
          if (subtestResult.status == 'passed') {
            this.passed += 1;
          } else if (subtestResult.status == 'failed') {
            this.failed += 1;
            if (browserInfo['knownFailures'].hasOwnProperty(subtestResult.fullname)) {
              subtestResult.status = 'failed-known';
              subtestResult.reason = 'Expected failure - ' + browserInfo['knownFailures'][subtestResult.fullname];
            }
          } else {
            this.skipped += 1;
          }
          this.tests.push(subtestResult);
        }
      }
    }
    this.tests.sort(function(a, b) { return a.fullname.localeCompare(b.fullname); });
    this.passrate = (this.passed / (this.total - this.skipped) * 100).toFixed(2);
  }
};