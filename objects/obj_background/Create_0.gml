napstablook_index = 0;

waver_sprite = spr_st;
a = 0;
b = 38.25;
c = 7;
d = 6;
e = 200;
script_ = 0

BGSINER = 0;
BG_SINER = 0;
BGMAGNITUDE = 6;
BG_ALPHA = 0;
ANIM_SINER = 0;
ANIM_SINER_B = 0;
TRUE_ANIM_SINER = 0;
BG_SPEED = 0.5;

ASGORE_MEME_FASE = 0;
ASGORE_MEME_SPRITES = [spr_asgore_meme_start, spr_asgore_meme_loop, spr_asgore_meme_end];
ASGORE_ATROPELOU = false;
ASGORE_LETRA_INDEX = 0;
ASGORE_LETRAS = [
	"Driving in my car, right after a beer",
	"Hey, that bump is shaped like a deer",
	"DUI?",
	"HOW ABOUT YOU DIE?",
	"I'LL GO A HUNDRED MILES",
	"AN HOUR",
	
	"Little, do you know, I filled up on gas",
	"Ima get your fountain making a**",
	"PULVERIZE THIS F***",
	"WITH MY BERGENTRUCK",
	"IT SEEM YOU'RE OUT OF LUCK",
	"TRUCK",
	
	"Beer is on the seat",
	"Blood is on the grass",
	"Won't admit defeat",
	"With cops right up my a**",
	"You may have a fleet",
	"But still I'm driving fast",
	"I'll never be passed",

	"I just saved the world",
	"From the darkest founts",
	"Killed a little girl",
	"Better for the town",
	"Gave this truck a whirl",
	"Heavy is my crown",
	"But I won't go down!",
	
	"Drive, drive, drive, but I am speed!",
	"Seven beers are all I need",
	"Try, just try, but I will lead!",
	"I bet that you're peeing your pants",
	
	"Drive, drive, drive, but I'll still speed!",
	"Seven beers, a pinch of w****",
	"Have fried, fried, fried my brain, I need",
	"Some more to proceed!",

	"Drive, drive, drive, but I am speed!",
	"Seven beers are all I need",
	"Try, just try, but I will lead!",
	"I bet that you're peeing your pants",

	"Drive, drive, drive, but I'll still speed!",
	"Seven beers, a pinch of w****",
	"Have fried, fried, fried my brain, I need",
	"Some more to proceed!",
	
	"Sh*t, did my dumba** just really hit a tree?",
	"Now I get up on my feet, and try to flee",
	"But I can't run, was it maybe all that w****?",
	"If I speak to them, maybe I'll be free!",
	"But they've got guns",
	"What happens when they see my w****?",
	"Did I really just rhyme w**** with w****?",
	
	"Alright, listen",
	"I can't be arrested",
	"I'm like the mountain king or some sh*t",
	"In another universe",
	"And that deer has some powers!!!",
	"I'm doing this world a favor",
	"Please",
	"Don't lock me up",
	
	"I just saved the world",
	"My thanks is thirty years to life",
	"For that girl to be alive",
	"And me to miss my wife",

	"Can't be in a cage",
	"All my flowers gonna die",
	"I've got a growing boy to raise",
	"I need her butterscotch pie",

	"Imma start hiding, see?",
	"I can only cry and mope",
	"There'll be a friend inside of me",
	"If I drop the f***ing soap",

	"I just wanna go home",
	"Wish I hadn't gotten stoned",
	"Now I'm stuck behind bars",
	"While my wife is getting b*****!",

	"K dot",
	"I'll miss you",
	"Go seal that dark fountain",
	"Also",
	"F*** Sans",
	"And his convenience store",
	" "
];

/// @param {real} value
/// @param {real} times
function repeat_assistent(value, times) {
	var arr = [];
	for (var i = 0; i < times; i++) {
		array_push(arr, value);
	}
	return arr;
}

var part_1 = repeat_assistent(2, 2);
var part_2 = repeat_assistent(4, 2);
var part_3 = repeat_assistent(1, 6);
var part_5 = repeat_assistent(2, 16);
var part_8 = repeat_assistent(1, 12);

var part1 = array_concat(part_2, part_1, [3, 1]);
var part2 = array_concat(part_2, part_1, [3, 2]);
var part3 = array_concat(part_3, [2]);
var part4 = array_concat(part_3, [2]);

var part6 = [5, 4, 4, 4, 2, 2, 5];
var part7 = [2, 1, 3, 1, 2, 2, 1, 2];
var part9 = [1, 1, 1, 2];
var part10 = [1, 1, 2, 1, 1, 17];

ASGORE_LETRAS_DELAY = array_concat(
	part1, part2, part3, part4, part_5,
	part6, part7, part_8, part9, part10
);