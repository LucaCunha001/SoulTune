// Create
btn_spacing = 20;
btn_width = 200;
btn_height = 20;
menu_x = 250;
menu_y = 15;
hovered_btn = -1;
selected_music = -1;
tocou_som = false;

scroll_y = 0;
scroll_speed = 20;
scroll_dragging = false;
touch_start_y = 0;
scroll_start_y = 0;

playlist_chaves = struct_get_names(global.playlists);

// Modos de ação
modo = "abrir"; // pode ser "abrir", "editar" ou "deletar"

// Botões laterais
btn_criar = {x: 20, y: 15, w: 100, h: 20};
btn_editar = {x: 20, y: 45, w: 100, h: 20};
btn_deletar = {x: 20, y: 75, w: 100, h: 20};
btn_voltar = {x: 20, y: 105, w: 100, h: 20};
lateral_buttons = [btn_criar, btn_editar, btn_deletar, btn_voltar];
lateral_names = ["Criar", "Editar", "Deletar", "Voltar"];

hovered_lateral = -1;