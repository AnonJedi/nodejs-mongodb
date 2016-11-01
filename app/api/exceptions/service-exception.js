'use strict';


class ServiceException {
	constructor(msg, stack) {
		this.stackTrace = `ServiceException: ${stack}.     ${msg}`;
		this.message = msg;
	}
}

module.exports = ServiceException;