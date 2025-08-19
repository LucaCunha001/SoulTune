/// @function sound_get_length(sound)
/// @description Retorna a duração do som em centésimos de segundo (1/100s).
/// @param {Asset.GMSound, Id.Sound} sound O recurso de áudio do tipo sound a ser medido.
/// @return {real}
function sound_get_length(argument0) {
	return ceil(audio_sound_length(argument0) * 100);
}