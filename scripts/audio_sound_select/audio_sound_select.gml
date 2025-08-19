/// @function audio_sound_select(som)
/// @param {Asset.GMSound} Som que será tocado
/// @description Toca um som de seleção

function audio_sound_select(argument0) {
	if (global.tocar_som) {
		audio_play_sound(argument0, 2, false);
	}
}