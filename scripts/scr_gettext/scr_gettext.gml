/// @function scr_gettext
/// @description Retorna o texto traduzido para a chave informada, ou uma mensagem de erro se não encontrado.
/// @param {string} chave A chave da string a ser traduzida.
/// @return {string} O texto traduzido correspondente à chave.

function scr_gettext(chave) {	
	var texto = ds_map_find_value(global.language_data, chave);
	if (texto == undefined) return string(undefined);
	return texto;
}