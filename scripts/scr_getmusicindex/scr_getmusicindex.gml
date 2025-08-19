/// @function scr_getmusicindex(index, capitulo)
/// @description Procura uma determinada música de acordo com seu index.
/// @param {real} index O index do OST (Varia de acordo com o jogo/capítulo selecionado).
/// @param {real} [capitulo] O capítulo do OST. Caso não for informado, usará a variável global.
/// @return {Asset.GMSound, undefined}

function scr_getmusicindex(argument0, argument1) {
	if (argument0 == -1 || (argument_count > 1 && argument1 == -1)) {
		return undefined;
	}
	
	var numero_str = string(argument0);
	if (argument0 < 10) {
		numero_str = "0" + string(argument0);
	}

	var folder_struct = global.folders[global.deltarune_cap];
	if (argument_count == 2 && argument1 >= 0 && argument1 < array_length(global.folders)) {
		folder_struct = global.folders[argument1];
	}
	var indices = ds_map_find_value(folder_struct, "indices");
	var path_base = ds_map_find_value(folder_struct, "path");

	var len = ds_list_size(indices);

	for (var i = 0; i < len; i++) {
		var nome_arquivo = indices[| i];
		
		var prefixo_esperado = numero_str + " - ";
		if (string_copy(nome_arquivo, 1, string_length(prefixo_esperado)) == prefixo_esperado) {

			var nome_musica = string_copy(nome_arquivo, string_length(prefixo_esperado) + 1, string_length(nome_arquivo));

			var caminho = path_base + "/" + nome_arquivo;

			if (file_exists(caminho)) {
				return audio_create_stream(caminho);
			}
		}
	}
	return undefined;
}