draw_set_font(fnt_main);
draw_set_valign(fa_top);
draw_set_halign(fa_left);
var xfade = (10 - fadebuffer) / 10;

if (xfade > 1)
	xfade = 1;

if (TYPE <= 2) {
	if (DRAWHEART == 1)
		draw_sprite_ext(sprite_index, 0, HEARTX + xoff, HEARTY + yoff, 1, 1, 0, c_white, 0.6 * xfade);
	
	draw_set_alpha(xfade);
	
	if (TYPE < 2) {
		var idx = 0;
		for (var i = 0; i <= YMAX; i++) {
			for (var j = 0; j <= XMAX; j++) {
				draw_set_color(c_white);
				
				if (CURX == j && CURY == i) {
					if (idx != global.background_index) {
						global.background_index = idx;
					}
					draw_set_color(c_yellow);
				}
		
				draw_text(NAMEX[j][i], NAMEY[j][i], string_hash_to_newline(NAME[j][i]));
				idx++;
			}
		}
	}
	
	if (TYPE == 2) {
		for (var i = 0; i <= YMAX; i += 1)
		{
			draw_set_color(c_white);
			
			if (CURY == i) {
				draw_set_color(c_yellow);
			}
			
			draw_text(NAMEX[0][i], NAMEY[0][i], string_hash_to_newline(NAME[0][i]));
		}
		if (global.language != idiomas[CURY]) {
			global.language = idiomas[CURY];
			save_user_options();
			__init_load_osts();
			if (instance_exists(obj_writer)) {
				instance_destroy(obj_writer);
				global.msg[0] = scr_gettext("obj_intro_splash0");
				obj_intro.W = instance_create_depth(60, 40, depth-1, obj_writer);
			}
		}
	}
	
	draw_set_alpha(1);
}

if (TYPE == 3)
{
	if (DRAWHEART == 1)
		draw_sprite_ext(sprite_index, 0, HEARTX, HEARTY, 1, 1, 0, c_white, 0.5 * xfade);
	
	draw_set_alpha(xfade);
	
	for (var j = 0; j <= YMAX; j += 1)
	{
		for (var i = 0; i <= XMAX; i += 1)
		{
			draw_set_color(c_white);
			
			if (CURX == i && CURY == j)
				draw_set_color(c_yellow);
			
			var str = string_hash_to_newline(NAME[i][j]);
			
			if (string_char_at(str, 1) == "(" && string_length(str) > 3)
				str = string_copy(str, 4, string_length(str) - 3);
			
			if (str != "<" && str != ">")
				draw_text(NAMEX[i][j], NAMEY[i][j], str);
		}
	}
	
	draw_set_color(c_white);
	
	if (string_length(NAMESTRING) == STRINGMAX)
		draw_set_color(c_yellow);
	
	var width = string_width(NAMESTRING);
	draw_text((320 - width) / 2, PLAYERNAMEY, string_hash_to_newline(NAMESTRING));
	draw_set_alpha(1);
}
