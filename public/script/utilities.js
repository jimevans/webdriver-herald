function showReason(target) {
  if (target.className != 'passed') {
    var child = target.querySelector('div');
    child.className = 'shown';
  }
}

function hideReason(target) {
  if (target.className != 'passed') {
    var child = target.querySelector('div');
    child.className = 'hidden';
  }
}
