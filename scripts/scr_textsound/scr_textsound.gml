function scr_textsound()
{
	playtextsound = 1;
	
	if (skippable == 0)
		playtextsound = 1;
	
	if (playtextsound == 1)
	{
		if (rate <= 2)
			getchar = string_char_at(mystring, pos);
		else
			getchar = string_char_at(mystring, pos - 1);
		
		play = 1;
		playcheck = 0;
		
		if (getchar == "&" || getchar == "\n")
		{
			if (rate < 3)
			{
				playcheck = 1;
				getchar = string_char_at(mystring, pos + 1);
			}
			else
			{
				play = 0;
			}
		}
		
		if (getchar == " ")
			play = 0;
		
		if (getchar == "^")
			play = 0;
		
		if (getchar == "!")
			play = 0;
		
		if (getchar == ".")
			play = 0;
		
		if (getchar == "?")
			play = 0;
		
		if (getchar == ",")
			play = 0;
		
		if (getchar == ":")
			play = 0;
		
		if (getchar == "/")
			play = 0;
		
		if (getchar == "\\")
			play = 0;
		
		if (getchar == "|")
			play = 0;
		
		if (getchar == "*")
			play = 0;
		
		if (play == 1)
		{
			snd_play(textsound);
			
			miniface_pos++;
		}
	}
}