//IS NULL OR EMPTY CHECK
function isNullOrEmpty(variable) {
    if (variable == '') return true;
    if (variable == null) return true;
    return false;
}

// GENERIC EVENT HANDLER
class Events {
	constructor(parent) {
        this.eventTriggers = {};
        this.parent = parent;
	}

	on(event, callback) {
		if (!this.eventTriggers[event]) {
			this.eventTriggers[event] = [];
		}

		this.eventTriggers[event].push(callback);
	}

	trigger(event, params) {
		if (this.eventTriggers[event]) {
			for (let trigger of this.eventTriggers[event]) {
                if (this.parent == undefined) {
                    trigger(params);
                } else {
                    trigger(this.parent, params);
                }
				
			}
		}
	}

	removeEvent(event) {
		if (this.eventTriggers[event]) {
			let index = this.eventTriggers.indexOf(event);
			this.eventTriggers.splice(index, 1);
		}
	}

	removeCallback(event, callback) {
		if (this.eventTriggers[event]) {
			let eventCallbacks = this.eventTriggers[event];
			if (eventCallbacks[callback]) {
				let callbackIndex = event.indexOf(callback);
				this.eventTriggers[event].splice(callbackIndex, 1);
			}
		}
	}
}

class MemoryEvents {
	constructor(parent) {
		this.memoryEvents = {};
		this.parent = parent;
    }
    
    hasTriggered(event) {
        if (this.memoryEvents[event]) {
            return this.memoryEvents[event].hasBeenTriggered;
        }
        return false;
    }

	on(event, callback, params) {
		if (!this.memoryEvents[event]) {
			this.memoryEvents[event] = {
				hasBeenTriggered: false,
				triggers: [],
			};
		}

        if (callback != undefined) {
            this.memoryEvents[event].triggers.push(callback);
        }
		

		if (this.memoryEvents[event].hasBeenTriggered) {
			this.triggerCallback(callback, params);
		}
	}

	trigger(event, params) {
		if (this.memoryEvents[event]) {
            this.memoryEvents[event].hasBeenTriggered = true;
			for (let callback of this.memoryEvents[event].triggers) {
				this.triggerCallback(callback,params);
			}
		} else {
            this.on(event);
            this.memoryEvents[event].hasBeenTriggered = true;
        }
    }
    
    triggerCallback(callback, params) {
        if (this.parent == undefined) {
            callback(params);
        } else {
            callback(this.parent, params);
        }
    }

	resetTrigger(event) {
		if (this.memoryEvents[event]) {
			this.memoryEvents[event].hasBeenTriggered = false;
		}
	}

	removeEvent(event) {
		if (this.memoryEvents[event]) {
			let index = this.memoryEvents.indexOf(event);
			this.memoryEvents.splice(index, 1);
		}
	}

	removeCallback(event, callback) {
		if (this.memoryEvents[event]) {
			let eventTriggers = this.memoryEvents[event].triggers;
			if (eventTriggers[callback]) {
				let callbackIndex = event.indexOf(callback);
				this.memoryEvents[event].splice(callbackIndex, 1);
			}
		}
	}
}

class AwaitedQueue {
	constructor(interval=50) {
		this.interval = interval;
		this.queue = [];
	}

	/*
		Adds a promise, if none exist it will run, if some exist it will
		wait for the previous ones to finish and then it will run
	*/
	add(name, condition)
	{
		let queueItem = {
			name: name,
			promise: null
		};

		let lastItem = (this.queue.length > 0) ? this.queue[this.queue.length - 1] : null;

		/* 
			If there are no items in the queue create promise and run
		*/
		if (this.queue.length == 0 || lastItem.promise == true) {
			let promise = new Promise(async (resolved) => {
				let statusCheck = setInterval(() => {
					if (eval(condition)) {
						resolved(true);
						clearInterval(statusCheck);
					}
				}, this.interval);
			});

			queueItem.promise = promise;
		} else {
		/* 
			If there are items in the queue wait for last promise to resolve
			then start promise
		*/
		let promise = new Promise(async (resolved) => {
			await lastItem.promise;

			let statusCheck = setInterval(() => {
				if (eval(condition)) {
					resolved(true);
					clearInterval(statusCheck);
				}
			}, this.interval);
		});

		queueItem.promise = promise;
	}

		this.queue.push(queueItem);
	}

	/*
		Will return the promise with name (name) so it can be awaited
		in another function
	*/
	on(name) {
		let queueItem = null;
		for (let item of this.queue) {
			if (item.name == name) {
				queueItem = item;
				break;
			}
		}

		return queueItem.promise;
	}
}

class ParamsParser {
    constructor(fields, params) {
        fields = this.parseArray(fields);
        params = (params == undefined) ? {} : params;
        this.params = this.fillIn(fields, params);
    }

    parseArray(array) {
        let fields = {};
        for (let item of array) {
            if (typeof(item) != "object") {
                fields[item] = None;
            } else {
                for (let key of Object.keys(item)) {
                    fields[key] = this.parseArray(item[key]);
                }
            }
        }

        return fields;
    }

    fillIn(fields, params) {
        let paramsKeys = Object.keys(params);
        for (let fieldKey of Object.keys(fields)) {
            if (!paramsKeys.includes(fieldKey)) {
                params[fieldKey] = None;
            }

            if (fields[fieldKey] != None) {
                params[fieldKey] = this.fillIn(fields[fieldKey], {});
            }
        }

        return params;
    }
}
