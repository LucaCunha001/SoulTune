function scr_openjson_struct(filename) {
	if (file_exists(filename)) {
		var _file = file_text_open_read(filename);
		var _json_string = "";
		while (!file_text_eof(_file)) {
			_json_string += file_text_read_string(_file);
			file_text_readln(_file);
		}
		file_text_close(_file);
		if (string_starts_with(_json_string, "[")) {
			file_delete(filename);
			return undefined;
		}
		return json_parse(_json_string);
	}
	return undefined;
}