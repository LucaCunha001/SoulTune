/// @function draw_bordered_rect
/// @description Desenha um retângulo com borda, opcionalmente destacando a borda se hovered.
/// @param {real} x1 Posição X do canto superior esquerdo
/// @param {real} y1 Posição Y do canto superior esquerdo
/// @param {real} x2 Posição X do canto inferior direito
/// @param {real} y2 Posição Y do canto inferior direito
/// @param {real} border_size Tamanho da borda em pixels
/// @param {bool} [hovered=false] Se true, usa c_yellow, senão c_white

function draw_bordered_rect(x1, y1, x2, y2, border_size, hovered) {
	if (argument_count < 6) hovered = false;
	
	var cor_atual = draw_get_color();
	var border_color = hovered ? c_yellow : c_white;
	
	draw_set_color(border_color);
	draw_rectangle(x1 - border_size, y1 - border_size, x2 + border_size, y2 + border_size, false);
	
	draw_set_color(c_black);
	draw_rectangle(x1 - (border_size-2), y1 - (border_size-2), x2 + (border_size-2), y2 + (border_size-2), false);
	
	draw_set_color(cor_atual);
}
