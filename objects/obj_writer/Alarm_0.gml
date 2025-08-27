if(stringpos < string_length(originalstring)) {
	stringpos++;
	if(global.typer == 111) stringpos++;
	alarm[0]= textspeed;
	if(string_char_at(originalstring, stringpos) == "^" && string_char_at(originalstring, stringpos + 1) != "0") {
		n= real(string_char_at(originalstring, stringpos + 1));
		alarm[0]= n * 10;
	} else  {
		if(txtsound == 56 || txtsound == 65 || txtsound == 71) {
			if(txtsound == 56) {
				if(string_char_at(originalstring, stringpos) != "" && string_char_at(originalstring, stringpos) != "^" && string_char_at(originalstring, stringpos) != "/" && string_char_at(originalstring, stringpos) != "%") {
					audio_stop_sound(56);
					audio_stop_sound(57);
					audio_stop_sound(58);
					audio_stop_sound(59);
					audio_stop_sound(60);
					audio_stop_sound(61);
					audio_stop_sound(62);
					audio_stop_sound(63);
					audio_stop_sound(64);
					var rnsound = floor(random(9));
					switch(rnsound) {
						case 8:
							snd_play(56/* snd_mtt1 */);
							break;
						case 7:
							snd_play(57/* snd_mtt2 */);
							break;
						case 6:
							snd_play(58/* snd_mtt3 */);
							break;
						case 5:
							snd_play(59/* snd_mtt4 */);
							break;
						case 4:
							snd_play(60/* snd_mtt5 */);
							break;
						case 3:
							snd_play(61/* snd_mtt6 */);
							break;
						case 2:
							snd_play(62/* snd_mtt7 */);
							break;
						case 1:
							snd_play(63/* snd_mtt8 */);
							break;
						case 0:
							snd_play(64/* snd_mtt9 */);
							break;
					}
				}
				stringpos+= 2;
			}
			if(txtsound == 71 && string_char_at(originalstring, stringpos) != "" && string_char_at(originalstring, stringpos) != "^" && string_char_at(originalstring, stringpos) != "/" && string_char_at(originalstring, stringpos) != "%") {
				audio_stop_sound(71);
				audio_stop_sound(72);
				audio_stop_sound(73);
				audio_stop_sound(74);
				audio_stop_sound(75);
				audio_stop_sound(76);
				audio_stop_sound(77);
				var rnsound= floor(random(7));
				switch(rnsound) {
					case 6:
						snd_play(71/* snd_wngdng1 */);
						break;
					case 5:
						snd_play(72/* snd_wngdng2 */);
						break;
					case 4:
						snd_play(73/* snd_wngdng3 */);
						break;
					case 3:
						snd_play(74/* snd_wngdng4 */);
						break;
					case 2:
						snd_play(75/* snd_wngdng5 */);
						break;
					case 1:
						snd_play(76/* snd_wngdng6 */);
						break;
					case 0:
						snd_play(77/* snd_wngdng7 */);
						break;
				}
			}
			if(txtsound == 65) {
				if(string_char_at(originalstring, stringpos) != "" && string_char_at(originalstring, stringpos) != "^" && string_char_at(originalstring, stringpos) != "/" && string_char_at(originalstring, stringpos) != "%") {
					audio_stop_sound(65);
					audio_stop_sound(66);
					audio_stop_sound(67);
					audio_stop_sound(68);
					audio_stop_sound(69);
					audio_stop_sound(70);
					var rnsound= floor(random(6));
					switch(rnsound) {
						case 5:
							snd_play(65/* snd_tem */);
							break;
						case 4:
							snd_play(66/* snd_tem2 */);
							break;
						case 3:
							snd_play(67/* snd_tem3 */);
							break;
						case 2:
							snd_play(68/* snd_tem4 */);
							break;
						case 1:
							snd_play(69/* snd_tem5 */);
							break;
						case 0:
							snd_play(70/* snd_tem6 */);
							break;
					}
				}
				stringpos++;
			}
		} else  {
			if(string_char_at(originalstring, stringpos) != "" && string_char_at(originalstring, stringpos) != " " && string_char_at(originalstring, stringpos) != "&" && string_char_at(originalstring, stringpos) != "^" && string_char_at(originalstring, stringpos - 1) != "^" && string_char_at(originalstring, stringpos) != "\\" + chr(ord("\"")) && string_char_at(originalstring, stringpos - 1) != "\\" + chr(ord("\"")) && string_char_at(originalstring, stringpos) != "/" && string_char_at(originalstring, stringpos) != "%") {
				audio_stop_sound(txtsound);
				snd_play(txtsound);
			}
		}
	}
	if(string_char_at(originalstring, stringpos) == "&")
		stringpos++;
	if(string_char_at(originalstring, stringpos) == "\\")
		stringpos+= 2;
}