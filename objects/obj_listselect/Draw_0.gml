draw_set_color(c_white);
draw_text(100, 80, titulo);
for (var i=0; i<array_length(opcoes); i++) {
	draw_bordered_rect(100,120+i*30,300,145+i*30,2,(hovered==i));
	draw_text(110, 132+i*30, opcoes[i]);
}