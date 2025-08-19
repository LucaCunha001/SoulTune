btn_count = 4;
btn_width = sprite_get_width(spr_delta_chapters);
btn_height = sprite_get_height(spr_delta_chapters);

btn_spacing = 20;
menu_total_width = btn_count * btn_width + (btn_count - 1) * btn_spacing;

menu_x = (room_width - menu_total_width) / 2;
menu_y = (room_height - btn_height) / 2;

hovered_btn = noone;
hover_sound_played = false;
clicking = false;
