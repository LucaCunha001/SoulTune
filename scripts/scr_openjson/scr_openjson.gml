/// @function scr_openjson(filename)
/// @description Abre e lê um arquivo JSON, retornando seu conteúdo decodificado como uma estrutura GML (ds_map, ds_list, etc).
/// @param {string} filename O caminho para o arquivo JSON a ser lido.
/// @return {Any, Undefined}

function scr_openjson(filename) {
	if (file_exists(filename)) {
		var _file, _json_string;
		_file = file_text_open_read(filename);
		_json_string = "";
		while (!file_text_eof(_file)) {
			_json_string += file_text_read_string(_file);
			file_text_readln(_file);
		}
		file_text_close(_file);
		return json_decode(_json_string);
	}
	return undefined;
}