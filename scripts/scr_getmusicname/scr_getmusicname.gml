/// @function scr_getmusicname(index)
/// @description Retorna o nome da música de acordo com seu index.
/// @param {real} index O índice da música na lista de OSTs.
/// @param {real} [capitulo] O capítulo do OST. Caso não for informado, usará a variável global.
/// @return {string, Undefined} O nome da música correspondente ao índice.

function scr_getmusicname(argument0, argument1) {
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
			var caminho = path_base + "/" + nome_arquivo;

			if (file_exists(caminho)) {
				var nome_musica = "";
				
				if (global.deltarune_cap == 0) {
					nome_musica = string_delete(nome_arquivo, 1, string_length("000 - "));
				} else {
					nome_musica = string_delete(nome_arquivo, 1, string_length("00 - "));
				}

				nome_musica = string_copy(nome_musica, 1, string_length(nome_musica) - 4);

				return nome_musica;
			}
		}
	}
	return undefined;
}