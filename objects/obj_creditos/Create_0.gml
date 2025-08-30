/// CREATE
save_user_options();

music_index = global.music_index;
is_looping = global.is_looping;

audio_stop_all();
tocar_musica(34, 4, false);

credits_con = 0;
credit_index = 0;
espacamento = 25;

// nomes das seções de créditos
creditos_names = [
	"main", "original", "music", "drawing", "dev",
	"vocals", "sfx", "programs", "programs2",
	"asgore", "asgore2", "thanks", "thanks2"
];

// glowing texts: [texto, inicio, fim]
glowing_text = [];
var i = 0;
while (true) {
	var texto = scr_gettext("obj_credits_slash" + string(i));
	if (texto != string(undefined)) {
		array_push(glowing_text, [texto, 0, 0]); // inicializa
		i++;
	} else break;
}

// tempos dos glowing (sincronizados)
glowing_text[0][1] = 60.4; glowing_text[0][2] = 67;
glowing_text[1][1] = 68;   glowing_text[1][2] = 75.9;
glowing_text[2][1] = 76;   glowing_text[2][2] = 83.31;
glowing_text[3][1] = 84;   glowing_text[3][2] = 89.4;
glowing_text[4][1] = 90;   glowing_text[4][2] = 98;

glowing_index = 0;
glowing_active = false;
auto_text_start = glowing_text[0][1];
auto_text_stop  = glowing_text[0][2];

// para medir compassos
measure_factor = 2;
measure_time   = 1.89371 * measure_factor;
measure_timer  = measure_time;

debug = true;

/// função auxiliar
function dequeue_text() {
	if (glowing_index >= array_length(glowing_text)) {
		audio_stop_all();
		instance_create_depth(0, 0, depth+1, obj_background);
		instance_create_depth(0, 0, depth, obj_config);
		instance_destroy();
		return;
	}
	
	global.typer = 666;
	global.fc = 0;
	global.msg[0] = glowing_text[glowing_index][0];

	auto_text_stop = glowing_text[glowing_index][2];
	
	var _writer = instance_create_depth(150, 80, depth-1, obj_writer);
	_writer.rate = 3;
	_writer.disablebutton1 = 1;
	_writer.skippable = 0;
	_writer.autocenter = 1;
	
	glowing_index++;
	
	if (glowing_index < array_length(glowing_text)) {
		auto_text_start = glowing_text[glowing_index][1];
	}
}