hovered = -1;
for (var i = 0; i < array_length(opcoes); i++) {
    var yy = y_ + i * (h + gap) + scroll_y;
    if (point_in_rectangle(mouse_x, mouse_y, x_, yy, x_ + w, yy + h)) {
        hovered = i;
        if (mouse_check_button_pressed(mb_left)) {
            if (is_callable(confirm_callback)) confirm_callback(opcoes[i]);
            instance_destroy();
        }
    }
}

if (mouse_wheel_up()) scroll_y = min(scroll_y + scroll_speed, 0);
if (mouse_wheel_down()) scroll_y -= scroll_speed;

if (os_type == os_android) {
    if (device_mouse_check_button_pressed(0, mb_left)) {
        scroll_dragging = true;
        touch_start_y = device_mouse_y(0);
        scroll_start_y = scroll_y;
    }

    if (scroll_dragging) {
        var dy = device_mouse_y(0) - touch_start_y;
        scroll_y = scroll_start_y + dy;
    }

    if (device_mouse_check_button_released(0, mb_left)) {
        scroll_dragging = false;
    }
}

var total_height = array_length(opcoes) * (h + gap);
var max_scroll = 0;
var min_scroll = -(total_height - (room_height - y_));

if (total_height < (room_height - y_)) {
    scroll_y = 0;
} else {
    scroll_y = clamp(scroll_y, min_scroll, max_scroll);
}
