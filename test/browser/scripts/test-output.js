/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * Helper - for help to control test output.
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */

(function(global) {

'use strict';

if (window.jQuery == null && window.jquery == null) {
  throw new Error('test-output.js - need jQuery.');
  return;
}


function TestOutput() {
  this.$target = $('#test-output');
}

TestOutput.prototype = {

  silentMode: function() {
    this.$target.addClass('HIDDEN');
  },

  visibleMode: function() {
    this.$target.removeClass('HIDDEN');
  }
}


global._TO_ = new TestOutput();

})(window);
