var headers = ds_map_create();
ds_map_add(headers, "User-Agent", "GameMakerStudio");

request_id = http_request("https://api.github.com/repos/LucaCunha001/SoulTune/releases/latest", "GET", headers, "");

ds_map_destroy(headers);