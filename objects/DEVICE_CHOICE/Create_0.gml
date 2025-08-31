CURX = 0;
CURY = 0;
XMAX = 0;
YMAX = 0;
NAME[0][0] = scr_gettext("DEVICE_CHOICE_slash0");
NAMEX[0][0] = 20;
NAMEY[0][0] = 20;
PLAYERNAMEY = 40;
TYPE = 2;
NAMESTRING = "";
STRINGMAX = 12;
xoff = 0;
yoff = 0;
global.choice = -1;

IDEALX = 0;
IDEALY = 0;
LANGSUBTYPE = 0;

idiomas = ["pt-br", "en-us"];
idx = 0;

if (TYPE == 2) {
	for (i = 0; i <= 1; i ++)
	{
		NAME[0][i] = string(1 + i);
		NAMEX[0][i] = 80;
		NAMEY[0][i] = 100 + (i * 20);
		YMAX += 1;
	}
	NAME[0][0] = "PORTUGUÊS";
	NAME[0][1] = "ENGLISH";
	HEARTX = NAMEX[0][0] - 20;
	HEARTY = NAMEY[0][0];
	XMAX = 0;
	YMAX = 1;
	xoff = -20;
}
if (TYPE == 1) {
	for (i = 0; i <= 100; i ++) {
		var texto = scr_gettext("obj_config_background" + string(i));
		if (texto == string(undefined)) {
			break;
		}
		NAME[0][i] = string(1 + i);
		NAMEX[0][i] = 80;
		NAMEY[0][i] = 100 + (i * 20);
		YMAX += 1;
	}
	HEARTX = NAMEX[0][0] - 20;
	HEARTY = NAMEY[0][0];
	XMAX = 0;
	YMAX = 1;
	xoff = -20;
}

HEARTX = NAMEX[0][0];
HEARTY = NAMEY[0][0];

if (TYPE == 0) {
	HEARTX = 150;
}

DRAWHEART = 1;
ONEBUFFER = 0;
TWOBUFFER = 0;
FINISH = 0;
fadebuffer = 10;

function right_p() {
	return keyboard_check_pressed(vk_right);
}
function left_p() {
	return keyboard_check_pressed(vk_left);
}
function up_p() {
	return keyboard_check_pressed(vk_up);
}
function down_p() {
	return keyboard_check_pressed(vk_down);
}
function button1_p() {
	return keyboard_check_pressed(vk_enter) || keyboard_check_pressed(ord("Z"));
}
function button2_p() {
	return keyboard_check_pressed(vk_shift) || keyboard_check_pressed(ord("X"));
}