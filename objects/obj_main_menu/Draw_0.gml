draw_set_color(c_white);

draw_set_halign(fa_center);
draw_set_valign(fa_middle);

var texto = scr_gettext("obj_main_menu_escolher_jogo");
draw_text_customizado(room_width/2, btn1_y-30, texto);

draw_bordered_rect(btn1_x - padding, btn1_y - padding, btn1_x + sprite_get_width(btn1_sprite) + padding, btn1_y + sprite_get_height(btn1_sprite) + padding, 2, (hovered_btn == 1));
draw_bordered_rect(btn2_x - padding, btn2_y - padding, btn2_x + sprite_get_width(btn2_sprite) + padding, btn2_y + sprite_get_height(btn2_sprite) + padding, 2, (hovered_btn == 2));
draw_bordered_rect(config_btnx - padding, config_btny - padding, config_btnx + sprite_get_width(config_btnsprite) + padding, config_btny + sprite_get_height(config_btnsprite) + padding, 2, (hovered_btn == 3));

draw_sprite(btn1_sprite, 0, btn1_x, btn1_y);
draw_sprite(btn2_sprite, 0, btn2_x, btn2_y);
draw_sprite(config_btnsprite, 0, config_btnx, config_btny);