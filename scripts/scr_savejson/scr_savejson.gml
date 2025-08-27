/// @function scr_savejson(filename, data)
/// @description Salva uma estrutura GML (ds_map, ds_list, etc) como JSON em um arquivo.
/// @param {String} filename O caminho para o arquivo JSON a ser salvo.
/// @param {Struct, Array, Id.DsMap, Id.DsList} data A estrutura GML que será codificada em JSON e salva no arquivo.
/// @return {Bool} Retorna true se o arquivo foi salvo com sucesso, caso contrário false.

function scr_savejson(filename, data) {
	if (is_undefined(data)) return false;

	var _json_string = json_stringify(data, true);
	if (string_length(_json_string) <= 0) return false;
	_json_string = string_replace_all(_json_string, "  ", "\t");

	var _file = file_text_open_write(filename);
	file_text_write_string(_file, _json_string);
	file_text_close(_file);

	return true;
}