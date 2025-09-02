function scr_script_delayed()
{
	var __scriptdelay = instance_create_depth(0, 0, 0, obj_script_delayed);
	__scriptdelay.script = argument[0];
	__scriptdelay.alarm[0] = argument[1] * 2;
	__scriptdelay.target = id;
	
	for (var __i = 0; __i < (argument_count - 2); __i++)
		__scriptdelay.script_arg[__i] = argument[__i + 2];
	
	__scriptdelay.arg_count = argument_count - 2;
	return __scriptdelay;
}


function scr_var_delay(arg0, arg1, arg2)
{
	scr_script_delayed(scr_var, arg2, arg0, arg1);
}

function scr_var_delayed(arg0, arg1, arg2)
{
	scr_script_delayed(scr_var, arg2, arg0, arg1);
}

function scr_delay_var(arg0, arg1, arg2)
{
	scr_script_delayed(scr_var, arg2, arg0, arg1);
}