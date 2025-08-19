draw_bordered_rect(btn1_x - 6, btn1_y - 6, btn1_x + sprite_get_width(btn1_sprite) + 6, btn1_y + sprite_get_height(btn1_sprite) + 6, 2, (hovered_btn == 1));
draw_bordered_rect(btn2_x - 6, btn2_y - 6, btn2_x + sprite_get_width(btn2_sprite) + 6, btn2_y + sprite_get_height(btn2_sprite) + 6, 2, (hovered_btn == 2));
draw_bordered_rect(config_btnx - 6, config_btny - 6, config_btnx + sprite_get_width(config_btnsprite) + 6, config_btny + sprite_get_height(config_btnsprite) + 6, 2, (hovered_btn == 3));

draw_set_color(c_white);
draw_sprite(btn1_sprite, 0, btn1_x, btn1_y);
draw_sprite(btn2_sprite, 0, btn2_x, btn2_y);
draw_sprite(config_btnsprite, 0, config_btnx, config_btny);