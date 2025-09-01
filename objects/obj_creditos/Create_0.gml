save_user_options();

musica_index = global.music_index;
is_looping = global.is_looping;
tempo = audio_sound_get_track_position(global.index_musica_atual);

con = 0;
timer = 0;
lyric = " ";
textalpha = 1;
creditalpha = 1;
trackpos = 0;
modifier = 0;
song1 = 0;
menugray = hexcolor(#949494);
y_pos = 0;
x_pos = room_width / 2;
line_height = 20;
title_credit[0] = scr_gettext("obj_credits_main_appname");
title_credit[1] = scr_gettext("obj_credits_main_by");
year_alpha = 0;
credit_index = -1;
credits = generate_credits();
credits_con = 0;
init = false;
loaded = true;
unlocked_trophies = false;
measure_factor = 2;
measure_time = 1.89371 * measure_factor;
measure_timer = measure_time;
glowing_active = false;
glowing_text = [];
continued_text = [];

for (var i=0; i<5; i++) {
	glowing_text[i][0] = scr_gettext("obj_credits_slash" + string(i));
}

for (var i=0; i<4; i++) {
	continued_text[i] = scr_gettext("obj_credits_continued_text" + string(i));
}
continued_text[2] = " ";

alt_text_enabled = false;

glowing_text[0][1] = 60.4;
glowing_text[0][2] = 67;
glowing_text[1][1] = 68;
glowing_text[1][2] = 75.9;
glowing_text[2][1] = 76;
glowing_text[2][2] = 83.31;
glowing_text[3][1] = 84;
glowing_text[3][2] = 89.4;
glowing_text[4][1] = 90;
glowing_text[4][2] = 98;
glowing_index = 0;
text_con = 0;
text_buffer = 2;
auto_text = false;
auto_text_start = glowing_text[glowing_index][1];
auto_text_stop = glowing_text[glowing_index][2];
auto_text_buffer_time = 60;
auto_text_buffer = auto_text_buffer_time;
paused = false;

dequeue_text = function()
{
	global.typer = 666;
	global.fc = 0;
	global.msg[0] = glowing_text[glowing_index][0];
	auto_text_stop = glowing_text[glowing_index][2];
	var _writer = instance_create_depth(150, 80, depth, obj_writer);
	_writer.rate = 3;
	_writer.disablebutton1 = 1;
	_writer.skippable = 0;
	_writer.autocenter = 1;
	
	if (alt_text_enabled)
		_writer.jpspecial = 1;
	
	glowing_index++;
	
	if (glowing_index < array_length(glowing_text))
		auto_text_start = glowing_text[glowing_index][1];
};

restart_game = function()
{
	glowing_active = false;
	con = -1;
	instance_create_depth(0, 0, depth+1, obj_background);
	instance_create_depth(0, 0, depth, obj_config);
	tocar_musica(musica_index[1], musica_index[0], is_looping);
	audio_sound_set_track_position(global.index_musica_atual, tempo)
	instance_destroy();
};