music_index = global.music_index;
is_looping = global.is_looping;

audio_stop_all();
tocar_musica(34, 4, false);

fase = 0;
slash = false;
espacamento = 25;
tempo = 5 * 60;
criou_txt = false;

creditos = [
	"main",
	"original",
	"music",
	"drawing",
	"dev",
	"vocals",
	"fonts",
	"sfx",
	"programs",
	"programs2",
	"asgore",
	"asgore2",
	"thanks",
	"thanks2"
];

global.msg = [];
for (var i=0; i<5; i++) {
	array_push(global.msg, scr_gettext("obj_credits_slash" + string(i)));
}
array_push(global.msg, " %%");
array_push(global.msg, "%%%");

alarm[0] = tempo;