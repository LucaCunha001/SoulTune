draw_set_color(c_white);
draw_text(x_, 80, titulo);

for (var i = 0; i < array_length(opcoes); i++) {
    var yy = y_ + i * (h + gap) + scroll_y;

    draw_bordered_rect(x_, yy, x_ + w, yy + h, 2, (hovered == i));

    var text_h = font_get_size(draw_get_font());
    var text_y = yy + (h - text_h) div 2;
    draw_text_customizado(x_ + 10, text_y, opcoes[i], (w - 10) / text_h);
}
