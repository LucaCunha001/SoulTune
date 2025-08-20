/// @function musica_primeiro_abril
/// @description Retorna a música especial do primeiro de abril de acordo com o capítulo e índice da música.
/// @param {real} index O índice da música.
/// @param {real} capitulo O capítulo correspondente ao índice.
/// @return {Asset.GMSound} O recurso de som (sound) correspondente à música escolhida.

function musica_primeiro_abril(index, capitulo) {
    var snd = snd_abril;
    
    if (capitulo == 0 && (index == 76 || index == 77)) {
        snd = snd_asgore_abril;
    }

    return snd;
}