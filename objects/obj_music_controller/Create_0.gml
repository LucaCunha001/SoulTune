progress = global.current_music_time / global.music_duration;

menu_x = 15;
menu_y = 0;
layout_width = 175;
layout_height = 100;

musics = [];

bar_w = 175;
bar_h = 10;
bar_x = menu_x + layout_width/2 - bar_w/2;
bar_y = menu_y + 102;

thumbnail_size = 116;

touching_bar = false;
is_looping = false;