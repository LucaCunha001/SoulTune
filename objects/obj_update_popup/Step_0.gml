if (point_in_rectangle(mouse_x, mouse_y, btn_x1, btn_y1, btn_x2, btn_y2)) {
    if (mouse_check_button_pressed(mb_left)) {
        instance_destroy();
    }
}