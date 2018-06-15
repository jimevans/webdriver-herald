exports.render = function(runId) {
  const fs = require('fs');

  if (runId == 'current') {
    var latestInfo = fs.readFileSync('./data/current.json', 'utf-8');
    var latest = JSON.parse(latestInfo);
    runId = latest.wpt;
  }

  var latestInfo = fs.readFileSync('./data/current.json', 'utf-8');
  var latest = JSON.parse(latestInfo);

  var data = fs.readFileSync('./data/wpt/' + runId + '/runinfo.json', 'utf-8');
  var runInfo = JSON.parse(data);
  var browsersInfo = runInfo['browsers'];

  const WptTestResults = require('../model/wpttestresults.js');
  var allResults = {};
  for (var browserType in browsersInfo) {
    var browser_info = browsersInfo[browserType];
    if (!fs.existsSync('./data/wpt/' + runId + '/' + browserType + '.json')) {
      console.log('Skipping results for ' + browserType);
    } else {
      data = fs.readFileSync('./data/wpt/' + runId + '/' + browserType + '.json', 'utf8');
      var obj = JSON.parse(data);
      var results = new WptTestResults(browser_info, obj);
      allResults[browserType] = results;
    }
  }

  const TestResultsCrosstab = require('../model/testresultscrosstab.js');
  var xtab = new TestResultsCrosstab(allResults);

  var pageData = {
    'rundate': runInfo.rundate,
    'commit': runInfo.commit,
    'windowsVersion': runInfo.windowsVersion,
    'macOSVersion': runInfo.macOSVersion,
    'notes': runInfo.notes,
    'summary': allResults,
    'crosstab': xtab
  };

  const Handlebars = require('handlebars');
  var fullPageTemplate = Handlebars.compile(fs.readFileSync('./view/wpt.template.html', 'utf-8'));
  var fullPage = fullPageTemplate(pageData);
  return fullPage;
}