'use strict';


module.exports = function(msg, stack) {
	this.stackTrace = stack;
	this.message = msg;
}