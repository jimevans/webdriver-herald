module.exports = class SeleniumTestCaseResult {
  constructor(resultObject) {
    this.status = resultObject['@result'].toLowerCase();
    this.fullname = resultObject['@fullname'];
    this.modulename = resultObject['@classname'];
    this.testname = resultObject['@methodname'];
    if (this.status == 'skipped') {
      var properties = resultObject['properties'];
      if (properties != null) {
        this.reason = properties['property']['@value'];
      } else {
        this.reason = resultObject['reason']['message']['#cdata-section'];
      }
    } else if (this.status == 'failed') {
      this.reason = resultObject['failure']['message']['#cdata-section'];
    } else {
      this.reason = 'passed';
    }
  }
};