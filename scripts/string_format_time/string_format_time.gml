function string_format_time(sec) {
	sec = floor(sec);
	var m = sec div 60;
	var s = sec mod 60;
	return string(m) + ":" + (s < 10 ? "0" + string(s) : string(s));
}