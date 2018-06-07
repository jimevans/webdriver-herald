exports.render = function() {
  const fs = require('fs');
  var latestInfo = fs.readFileSync('./data/current.json', 'utf-8');
  var latest = JSON.parse(latestInfo);

  var data = fs.readFileSync('./data/selenium/' + latest.selenium + '/runinfo.json', 'utf-8');
  var runInfo = JSON.parse(data);
  var browsersInfo = runInfo['browsers'];

  const TestResults = require('../model/testresults.js');
  var allResults = {};
  for (var browserType in browsersInfo) {
    var browser_info = browsersInfo[browserType];
    if (!fs.existsSync('./data/selenium/' + latest.selenium + '/' + browserType + '.json')) {
      console.log('Skipping results for ' + browserType);
    } else {
      console.log('Processing results for ' + browserType);
      data = fs.readFileSync('./data/selenium/' + latest.selenium + '/' + browserType + '.json', 'utf8');
      var obj = JSON.parse(data);
      var results = new TestResults(browser_info, obj);
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
    'summary': allResults,
    'crosstab': xtab
  };

  const Handlebars = require('handlebars');
  var fullPageTemplate = Handlebars.compile(fs.readFileSync('./view/selenium.template.html', 'utf-8'));
  var fullPage = fullPageTemplate(pageData);
  return fullPage;
}