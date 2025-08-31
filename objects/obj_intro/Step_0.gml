switch (EVENT) {
	case 0:
		global.fc = 0;
		global.typer = 667;
		
		if (global.ja_configurou) {
			audio_play_sound(AUDIO_DRONE, 1, true);
			global.msg[0] = scr_gettext("obj_intro_splash4");
			EVENT = 1;
			W = instance_create_depth(110, room_height/2, depth-1, obj_writer);
		} else {			
			tocar_musica(1, 1, true);
			global.msg[0] = scr_gettext("obj_intro_splash0");
			EVENT = 30;
			alarm[4] = 110;
			W = instance_create_depth(60, 40, depth-1, obj_writer);
		}
		break;

	case 1:
		if (!instance_exists(obj_writer)) {
			audio_play_sound(AUDIO_APPEARANCE, 2, false);
			
			var soul_size = 4;
			SOUL = instance_create_depth(
				(room_width  - sprite_get_width(icone)*soul_size) / 2,
				(room_height - sprite_get_height(icone)*soul_size) / 2,
				depth-1, DEVICE_APPEARANCE
			);
			SOUL.image_xscale = soul_size;
			SOUL.image_yscale = soul_size;
			
			EVENT = 2;
			alarm[4] = 20;
		}
		break;

	case 3:
		HEARTMADE = 1;
		HSINER = 0;
		EVENT = 4;
		alarm[4] = 90;
		break;

	case 5:
		global.msg[0] = scr_gettext("obj_intro_splash5");
		global.msg[1] = scr_gettext("obj_intro_splash6");
		
		W = instance_create_depth(110, room_height/2, depth-2, obj_writer);
		W.autocenter = 1;
		
		EVENT = 5.1;
		break;

	case 5.1:
		if (!instance_exists(obj_writer)) {
			snd_play(AUDIO_APPEARANCE);
			HEARTMADE = 0;
			SOUL.t -= 2;
			SOUL.momentum = -0.5;
			
			EVENT = 5.2;
			alarm[4] = 60;
		}
		break;

	case 6.2:
		EVENT = -2;
		alarm[4] = 120;
		break;


	case 31:
		choice = instance_create_depth(100, 120, depth-1, DEVICE_CHOICE);
		EVENT = 32;
		break;

	case 32:
		if (global.choice > -1) {
			EVENT = 33;
		}
		break;
	
	case 33:
		EVENT = 34;
		alarm[4] = 26;
		break;

	case 35:
		with (obj_writer) instance_destroy();
		
		global.choice = -1;
		global.msg[0] = scr_gettext("obj_intro_splash1"); 
		
		W = instance_create_depth(60, 40, 0, obj_writer);
		EVENT = 36;
		alarm[4] = 110;
		break;

	case 37:
		if (!instance_exists(obj_background)) {
			instance_create_depth(0, 0, depth+1, obj_background);
		}
		choice = instance_create_depth(100, 120, depth-1, DEVICE_CHOICE);
		
		with (choice) {
			TYPE = 1;
			XMAX = 1;
			YMAX = -1;
			for (var i = 0; i <5; i ++) {
				for (var j=0; j<2; j++) {
					NAME[j][i] = string(1 + i);
					NAMEX[j][i] = 35 + (j * 245);
					NAMEY[j][i] = 100 + (i * 20);
				}
				YMAX += 1;
			}
			HEARTX = NAMEX[0][0] - 20;
			HEARTY = NAMEY[0][0];
			xoff = -20;
			var idx = 0;
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < 2; j++) {
					var texto = scr_gettext("obj_config_background" + string(idx+1));
					if (texto != string(undefined)) {
						NAME[j][i] = texto;
					}
					idx++;
				}
			}
		}
		EVENT = 38;
		alarm[4] = 110;
		break;
	
	case 39:
		if (global.choice > -1 && !instance_exists(DEVICE_CHOICE)) {
			with (obj_background) {
				var multiplicador = (global.background_index == 0) ? 1 : 2;
				var limite = 0.5 * multiplicador;

				if (BG_ALPHA > -limite) {
					BG_ALPHA -= (0.04 - (BG_ALPHA / (14 * multiplicador))) * multiplicador;
					if (BG_ALPHA < -limite) BG_ALPHA = -limite;
				} else {
					obj_intro.EVENT = 40;
					instance_destroy();
				}
			}
		}
		break;
	
	case 40:
		with (obj_writer) instance_destroy();
		EVENT = 41;
		break;
	
	case 41:
		global.typer = 666;
		global.msg[0] = scr_gettext("obj_intro_splash3");
		global.msg[1] = scr_gettext("obj_intro_splash6");
		W = instance_create_depth(110, room_height/2, depth-2, obj_writer);
		W.autocenter = 1;
		EVENT = 42;
		alarm[4] = 110;
		break;
		
	case 43:
		if (!instance_exists(obj_writer)) {
			global.ja_configurou = true;
			save_user_options();
			EVENT = -2;
			alarm[4] = 110;
		}
		break;

	case -1:
		if (is_callable(transition)) {
			transition();
			instance_destroy();
		}
		break;
}


if (scr_debug()) {
	if (keyboard_check_pressed(vk_f3)) {
		EVENT = 7;
	}
}

if (!instance_exists(obj_background)) {
	teclas();
}