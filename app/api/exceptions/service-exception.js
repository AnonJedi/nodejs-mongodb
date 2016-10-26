'use strict';


module.exports = function(msg, stack) {
	this.stackTrace = `ServiceException: ${stack}.     ${msg}`;
	this.message = msg;
}