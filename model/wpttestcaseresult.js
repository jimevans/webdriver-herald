module.exports = class WptTestCaseResult {
  constructor(fileName, resultObject) {
    function fixStatus(originalStatus) {
      if (originalStatus.toLowerCase() == 'pass') {
        return 'passed';
      }
      if (originalStatus.toLowerCase() == 'fail') {
        return 'failed';
      }
      if (originalStatus.toLowerCase() == 'error') {
        return 'error';
      }
    }
    this.status = fixStatus(resultObject['status']);
    this.modulename = fileName;
    this.testname = resultObject['name'];
    this.fullname = fileName + '/' + resultObject['name'];
    if (this.status == 'failed') {
      this.reason = resultObject['message'];
    } else {
      this.reason = 'passed';
    }
  }
};
