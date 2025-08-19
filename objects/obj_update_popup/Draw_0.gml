draw_set_font(fnt_main);
draw_set_halign(fa_center);
draw_set_valign(fa_middle);

draw_bordered_rect(x1, y1, x1+w, y1+h, 4, false);

draw_set_color(c_white);
draw_text_customizado((room_width/2), y1+20, global.update_message);

var is_hover = point_in_rectangle(mouse_x, mouse_y, btn_x1, btn_y1, btn_x2, btn_y2);

draw_bordered_rect(btn_x1, btn_y1, btn_x2, btn_y2, 2, is_hover);
draw_set_color(is_hover ? c_yellow : c_white);
draw_text(btn_x1+btn_w/2, btn_y1+btn_h/2, "OK");