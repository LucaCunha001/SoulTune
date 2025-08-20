if (global.deltarune_cap == 0) {
	simple_buttons = [
		scr_gettext("obj_music_selector_button_switch_game"),
		scr_gettext("obj_music_selector_button_playlist")
	];

	simple_objects = [
		obj_main_menu,
		obj_playlists
	];
} else {
	simple_buttons = [
		scr_gettext("obj_music_selector_button_switch_game"),
		scr_gettext("obj_music_selector_button_switch_chapter"),
		scr_gettext("obj_music_selector_button_playlist")
	];

	simple_objects = [
		obj_main_menu,
		obj_chapter_select,
		obj_playlists
	];
}

img_buttons = [
	[scr_gettext("obj_music_selector_img_lutas"), spr_sansbface],
	[scr_gettext("obj_music_selector_img_fundo"), spr_deltarune],
	[scr_gettext("obj_music_selector_img_cutscenes"), spr_undyne_over],
	[scr_gettext("obj_music_selector_img_todas"), spr_simbolo_musica]
];

btn_spacing = 30;
btn_u_width = 125;
btn_d_width = 75;
btn_height = 50;
font_size = 24;

hovered_btn = -1;
hovered_section = -1;
hover_sound_played = false;
clicking = false;
