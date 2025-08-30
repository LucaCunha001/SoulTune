// Etapa
switch(EVENT) {
    case 0:
        global.typer = 666;
        global.fc = 0;
        global.msg[0] = scr_gettext("obj_intro_splash0");
        W = instance_create_depth(110, 50, depth-1, obj_writer);
        W.autocenter = 1;
        EVENT = 1;
        break;

    case 1:
        if (!instance_exists(obj_writer)) {
            audio_play_sound(AUDIO_APPEARANCE, 1, false);
            var soul_size = 4;
            SOUL = instance_create_depth(
                (room_width - sprite_get_width(icone)*soul_size)/2,
                (room_height - sprite_get_height(icone)*soul_size)/2,
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
        global.msg[0] = scr_gettext("obj_intro_splash1");
        global.msg[1] = scr_gettext("obj_intro_splash2");
        W = instance_create_depth(110, room_height / 2, depth-2, obj_writer);
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
        EVENT = 6;
        alarm[4] = 120;
        break;

    case 7:
        if (is_callable(transition)) {
            transition();
        }
        break;
}

teclas();