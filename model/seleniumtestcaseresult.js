module.exports = class SeleniumTestCaseResult {
  constructor(resultObject) {
    if (resultObject['@result']) {
      this.status = resultObject['@result'].toLowerCase();
    } else if (resultObject['@status']) {
      this.status = resultObject['@status'].toLowerCase();
    } else {
      throw "No status attribute ('@result' or '@status') found in test result.";
    }

    if (resultObject['@methodname']) {
      this.testname = resultObject['@methodname'];
    } else if (resultObject['@name']) {
      this.testname = resultObject['@name'];
    } else {
      throw "No test name attribute ('@methodname' or '@name') found in test result.";
    }

    if (resultObject['@classname']) {
      this.modulename = resultObject['@classname'];
    } else {
      throw "No test class attribute ('@classname') found in test result.";
    }

    if (resultObject['@fullname']) {
      this.fullname = resultObject['@fullname'];
    } else {
      this.fullname = this.modulename + '.' + this.testname;
    }

    if (this.status === 'skipped') {
      if (resultObject['properties']) {
        var properties = resultObject['properties'];
        if (properties !== null) {
          this.reason = properties['property']['@value'];
        } else {
          this.reason = resultObject['reason']['message']['#cdata-section'];
        }
      } else if (resultObject['skipped']) {
        this.reason = resultObject['skipped'][1]['@message'];
      }
    } else if (this.status === 'failed') {
      var failureObject = resultObject['failure'];
      if (failureObject['message']) {
        this.reason = failureObject['message']['#cdata-section'].trim();
      } else {
        this.reason = failureObject['@message'].trim();
      }
    } else {
      this.reason = 'passed';
    }
  }
};
