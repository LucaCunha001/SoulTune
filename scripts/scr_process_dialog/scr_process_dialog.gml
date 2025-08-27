/// @function scr_process_dialog(_texto, _max_chars)
/// @desc Formata o texto, quebrando linhas sem cortar palavras.
/// @param {string} _texto
/// @param {real} _max_chars
function scr_process_dialog(_texto, _max_chars) {
	var palavras = string_split(_texto, " ");
	var texto_final = "";
	var linha_atual = "";

	for (var i = 0; i < array_length(palavras); i++) {
		var palavra = palavras[i];
		var teste = (linha_atual == "" ? palavra : linha_atual + " " + palavra);

		if (string_length(teste) > _max_chars) {
			texto_final += linha_atual + "\n";
			if (string_char_at(linha_atual, i+1) != "*") {
				texto_final += "  ";
			}
			linha_atual = palavra;
		} else {
			linha_atual = teste;
		}
	}

	if (linha_atual != "") {
		texto_final += linha_atual;
	}

	return texto_final;
}