/// @function load_osts()
/// @description Atualiza a pasta global de músicas (global.folder) de acordo com o capítulo selecionado de Deltarune (Undertale, caso o selecionado for 0).
/// @remarks Usa a variável global.deltarune_cap para escolher o índice correto na lista global.folders.
/// @return {Undefined}

function load_osts() {
	global.folder = global.folders[global.deltarune_cap];
}