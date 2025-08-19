btn1_sprite = spr_undertale;
btn1_x = 150;
btn1_y = 110;

btn2_sprite = spr_deltarune;
btn2_x = room_width - btn1_x - sprite_get_width(btn2_sprite);
btn2_y = 110;

config_btnsprite = spr_config;
config_btnx = room_width - sprite_get_width(config_btnsprite) - 10;
config_btny = 10;

hovered_btn = noone;
hover_sound_played = false;
clicking = false;