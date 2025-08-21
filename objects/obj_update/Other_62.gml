if (async_load[? "id"] == request_id) {
	if (async_load[? "status"] == 0) {
		show_debug_message("Houve um erro durante a requisição.");
		instance_destroy();
	}
	if (async_load[? "result"] == undefined) {
		show_debug_message("Chave 'result' não encontrada no async_load!");
		exit;
	}

	var json_text = async_load[? "result"];
	
	function extrairVersao(v_str) {
		var pos_v = string_pos("v", v_str);
		if (pos_v > 0) {
			return string_copy(v_str, pos_v + 1, string_length(v_str) - pos_v);
		} else {
			return v_str;
		}
	}

	function versaoParaArray(v_str) {
		var partes = string_split(v_str, ".");
		while (array_length(partes) < 3) {
			array_push(partes, "0");
		}
		for (var i = 0; i < 3; i++) {
			var num_str = string_trim(partes[i]);
			partes[i] = real(num_str);
		}
		return partes;
	}
	
	var dados = json_parse(json_text);
	
	var tag_online = "";
	if (variable_struct_exists(dados, "tag_name")) {
		tag_online = string(dados.tag_name);
	} else {
		show_debug_message("Chave 'tag_name' não encontrada no JSON!");
		exit;
	}

	var versao_num = extrairVersao(tag_online);
	var versao_online = versaoParaArray(versao_num);
	var versao_local = versaoParaArray(GM_version);

	function versaoMaior(v1, v2) {
		for (var i = 0; i < 3; i++) {
			if (v1[i] > v2[i]) return true;
			else if (v1[i] < v2[i]) return false;
		}
		return false;
	}

	if (versaoMaior(versao_online, versao_local)) {
		var versao_str = string(versao_online[0]) + "." + string(versao_online[1]) + "." + string(versao_online[2]);
		var versao_atual = string(versao_local[0]) + "." + string(versao_local[1]) + "." + string(versao_local[2]);
		global.update_message = scr_gettext("obj_update_VMR") + " " + versao_str + ". " + scr_gettext("obj_update_VA") + " " + versao_atual + ". " + scr_gettext("obj_update_RAA");
		instance_create_depth(0, 0, depth-5, obj_update_popup);
	}
	instance_destroy();
}
