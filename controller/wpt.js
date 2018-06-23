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
  Handlebars.registerHelper('result', function(results, browsers) {
    var str = '';
    for (var i = 0; i < browsers.length; i++) {
      str += '<td>';
      var browserDescription = browsers[i];
      var resultClass = "failed-missing";
      var resultDescription = browserDescription + "<br>Missing data! No results available!";
      if (results.hasOwnProperty(browserDescription)) {
        var browserResult = results[browserDescription];
        if (browserResult.reason) {
          resultClass = browserResult.status;
          resultDescription = browserDescription + ':<br>' + browserResult.reason;
        } else {
          resultClass = browserResult.status + '-missing';
          resultDescription = browserDescription + ':<br>No reason given';
        }
      }
      str += '<div class="' + resultClass + '" onmouseover="showReason(this)" onmouseout="hideReason(this)">';
      str += '&nbsp;';
      str += '<div class="hidden"><pre>' + resultDescription + '</pre></div>';
      str += '</div>';
      str += '</td>';
    }
    return str;
  });
  var fullPageTemplate = Handlebars.compile(fs.readFileSync('./view/wpt.template.html', 'utf-8'));
  var fullPage = fullPageTemplate(pageData);
  return fullPage;
}