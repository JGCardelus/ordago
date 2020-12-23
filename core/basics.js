//IS NULL OR EMPTY CHECK
function is_null_or_empty(variable) {
    if (variable == '') return true;
    if (variable == null) return true;
    return false;
}

// JOIN INTO STRING
function join_2_string(array, glue) {
	let output = "";
	for (let i = 0; i < array.length - 1; i++) {
		output += element + glue;
	}
	output += array[array.length - 1];
	return output;
}

// CREATE ID
function create_id(prefix, id_list) {
	let id_count = id_list.length;
	let id = prefix + id_count;

	while (id_list.includes(id)) {
		id_count += 1;
		id = prefix + id_count;
	}

	return id;
}

// REMOVE OBJECT FROM ARRAY
function remove(elem, array) {
	let index = array.indexOf(elem);
	array.splice(index, 1);
}

// GENERIC EVENT HANDLER
class Events {
	constructor(parent) {
        this.event_triggers = {};
        this.parent = parent;
	}

	on(event, callback) {
		if (!this.event_triggers[event]) {
			this.event_triggers[event] = [];
		}

		this.event_triggers[event].push(callback);
	}

	trigger(event, params) {
		if (this.event_triggers[event]) {
			for (let trigger of this.event_triggers[event]) {
                if (this.parent == undefined) {
                    trigger(params);
                } else {
                    trigger(this.parent, params);
                }
				
			}
		}
	}

	remove_event(event) {
		if (this.event_triggers[event]) {
			let index = this.event_triggers.indexOf(event);
			this.event_triggers.splice(index, 1);
		}
	}

	remove_callback(event, callback) {
		if (this.event_triggers[event]) {
			let event_callbacks = this.event_triggers[event];
			if (event_callbacks[callback]) {
				let callback_index = event.indexOf(callback);
				this.event_triggers[event].splice(callback_index, 1);
			}
		}
	}
}

class Memory_Events {
	constructor(parent) {
		this.memory_events = {};
		this.parent = parent;
    }
    
    has_triggered(event) {
        if (this.memory_events[event]) {
            return this.memory_events[event].has_been_triggered;
        }
        return false;
    }

	on(event, callback, params) {
		if (!this.memory_events[event]) {
			this.memory_events[event] = {
				has_been_triggered: false,
				triggers: [],
			};
		}

        if (callback != undefined) {
            this.memory_events[event].triggers.push(callback);
        }
		

		if (this.memory_events[event].has_been_triggered) {
			this.trigger_callback(callback, params);
		}
	}

	trigger(event, params) {
		if (this.memory_events[event]) {
            this.memory_events[event].has_been_triggered = true;
			for (let callback of this.memory_events[event].triggers) {
				this.trigger_callback(callback,params);
			}
		} else {
            this.on(event);
            this.memory_events[event].has_been_triggered = true;
        }
    }
    
    trigger_callback(callback, params) {
        if (this.parent == undefined) {
            callback(params);
        } else {
            callback(this.parent, params);
        }
    }

	reset_trigger(event) {
		if (this.memory_events[event]) {
			this.memory_events[event].has_been_triggered = false;
		}
	}

	remove_event(event) {
		if (this.memory_events[event]) {
			let index = this.memory_events.indexOf(event);
			this.memory_events.splice(index, 1);
		}
	}

	remove_callback(event, callback) {
		if (this.memory_events[event]) {
			let event_triggers = this.memory_events[event].triggers;
			if (event_triggers[callback]) {
				let callback_index = event.indexOf(callback);
				this.memory_events[event].splice(callback_index, 1);
			}
		}
	}
}

class Params_Parser {
    constructor(fields, params) {
        fields = this.parse_array(fields);
        params = (params == undefined) ? {} : params;
        this.params = this.fill_in(fields, params);
    }

    parse_array(array) {
        let fields = {};
        for (let item of array) {
            if (typeof(item) != "object") {
                fields[item] = None;
            } else {
                for (let key of Object.keys(item)) {
                    fields[key] = this.parse_array(item[key]);
                }
            }
        }

        return fields;
    }

    fill_in(fields, params) {
        let params_keys = Object.keys(params);
        for (let field_key of Object.keys(fields)) {
            if (!params_keys.includes(field_key)) {
                params[field_key] = None;
            }

            if (fields[field_key] != None) {
                params[field_key] = this.fill_in(fields[field_key], {});
            }
        }

        return params;
    }
}

class Styles_Formatter {
	constructor() {
		this.possible_styles = null;	
	}

	parse(styles) {
		let parsed_styles = "{";
		for (let style_key of Object.keys(styles)) {
			let value = styles[style_key];
			let style_line = style_key + ": " + value + ";\n";
			parsed_styles += style_line;
		}
		parsed_styles += "}"
		return parsed_styles;
	}

	format_class(class_name, styles) {
		let parsed_styles = this.parse(styles);
		let formatted_styles = `.${class_name} ${parsed_styles}`;
		return formatted_styles;
	}
}

let styles_formatter = new Styles_Formatter();

class Wrapper {
	constructor(selector) {
		this.selector = selector;
		this.element = document.querySelector(selector);
	}

	delete() {
		this.get(this.selector);
		this.element.remove();
	}

	html(html) {
		this.get(this.selector);
		this.element.innerHTML = html;
	}

	append(html) {
		this.get(this.selector);
		this.element.innerHTML += html;
	}

	remove(selector) {
		this.get(this.selector);
		let child_exists = this.element.querySelector(selector);
		if (child_exists != null) {
			this.element.removeChild(selector);
		}
	}

	get(selector) {
		this.selector = selector;
		this.element = document.querySelector(selector);
		return this.element;
	}

	exists(selector) {
		let element = this.element.querySelector(selector);
		if (element != null) {
			return true;
		} return false;
	}

	add_class(class_name) {
		this.get(this.selector);
		this.element.className += " " + class_name;
	}

	has_class(class_name) {
		this.get(this.selector);
		let class_names_in_element = this.element.className.split(" ");
		for (let class_name_in_element of class_names_in_element) {
			if (class_name_in_element == class_name) {
				return true;
			}
		}

		return false;
	}

	remove_class(class_name) {
		this.get(this.selector);
		let index = 0;
		let exists = false;

		let class_names_in_element = this.element.className.split(" ");
		for (let i = 0; i < class_names_in_element.length; i++) {
			let test_class_name = class_names_in_element[i];
			if (test_class_name == class_name) {
				index = i;
				exists = true;
			}
		}

		if (!exists) {
			return false;
		}

		class_names_in_element.splice(index, 1);
		let updated_class_names = join_2_string(class_names_in_element, " ");
		this.element.className = updated_class_names;
		return true;
	}
}