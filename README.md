# webdriver-herald
Web site that generates a report of test results for WebDriver implementations when run against standard test suites.

This repo holds the Node.js code for a web site that displays the results of the execution of specific
WebDriver-based test suites against multiple browsers. Currently, the data used is the results from the 
[Selenium project's](https://github.com/SeleniumHQ/selenium) .NET common integration 
[test suite](https://github.com/SeleniumHQ/selenium/tree/master/dotnet/test/common). The output of
these tests, run using NUnit are converted from XML to JSON, and used to generate the pages displayed
by this site.

The tests are currently run against the following browsers:
* Internet Explorer (Latest stable release)
* Mozilla Firefox (Latest stable Release)
* Mozilla Firefox Nightly
* Google Chrome (Latest stable release)
* Microsoft Edge (Latest Insider release with driver in legacy protocol mode)
* Microsoft Edge (Latest Insider release with driver in W3C compliant protocol mode)
* Apple Safari (Latest stable release)
* Apple Safari Technology Preview

Future versions of this site should also include results of executions of the
[Web Platform Tests](https://github.com/web-platform-tests/wpt) WebDriver Specification
[test suite](https://github.com/web-platform-tests/wpt/tree/master/webdriver).
