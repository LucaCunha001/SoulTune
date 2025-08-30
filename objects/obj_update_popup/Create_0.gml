w = 300;
h = 120;
x1 = (room_width - w)/2;
y1 = (room_height - h)/2;

btn_w = 100;
btn_h = 24;
btn_spacing = 20;

total_width = btn_w * 2 + btn_spacing;
btn_group_x = (room_width - total_width)/2;
btn_y = y1 + 80;

btn_x1 = btn_group_x;
btn_y1 = btn_y;
btn_x2 = btn_x1 + btn_w;
btn_y2 = btn_y1 + btn_h;

btn2_x1 = btn_x1 + btn_w + btn_spacing;
btn2_y1 = btn_y;
btn2_x2 = btn2_x1 + btn_w;
btn2_y2 = btn2_y1 + btn_h;