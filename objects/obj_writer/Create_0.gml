writingx= 0;
writingy= 0;
global.typer = 666;
x= round(x);
y= round(y);
scr_textsetup(fnt_main, c_white, (x + 20), (y + 20), 400, 1, 8, snd_nosound, 16, 18)
doak= 0;
stringno= 0;
stringpos= 1;
lineno= 0;
halt= 0;
writingx= round(writingx);
writingy= round(writingy);
myx= writingx;
myy= writingy;
n= 0;
while(global.msg[n] != "%%%") {
	mystring[n]= global.msg[n];
	n++;
}
originalstring= mystring[0];
dfy= 0;
alarm[0]= textspeed;