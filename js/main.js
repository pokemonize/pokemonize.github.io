$(document).ready(function() {
    
    var pokes = new Array();
    var pkDex = "";
    var pkNumber = 0;
    
    function message(type, msg){
        
        var color;
        
        switch(type){
            case "success": 
                color = '#06FD00'
            break;
            
            case "warning": 
                color = '#FDE800'
            break;
            
            case "danger": 
                color = '#FF0000'
            break;
        }
        
        var div = $('<div id="temp" class="col-xs-8 col-xs-offset-2 fix alert text-center" role="alert" style="z-index:1; position: absolute; background-color:#222222; color:'+color+'; max-height:49px; font-family:Verdana">'
                    ).text(msg);
        
        $('#nav').before(
            $('#nav').css('z-index', '-1'),
            div.hide().fadeIn('fast').delay(2500).slideUp('fast', function(){
                $(this).remove();
            }),
            $('#nav').css('z-index', '0')
        );
        
    }    
    
    function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
    }

    function carregarPokes() {

        jQuery.get('res/pk_name.txt', function(data) {
            var pkmns = data.split("\n");
            
            pkmns.sort(function(a, b) {
                return a.localeCompare(b.toUpperCase());
            });
            
            var combo = $("#pkName");
            for (var i = 0; i < pkmns.length; i++) {
                combo.append($("<option />").text(pkmns[i]));
            }
        });
    }

    function carregarItemOras() {
        
        jQuery.get('res/pk_items_oras.txt', function(data) {
            var items = data.split("\n");
            var combo = $("#pkItemORAS");
            for (var i = 22; i < items.length; i++) {
                combo.append($("<option />").text(items[i]));
            }
        });
    }

    function carregarNature() {

        jQuery.get('res/pk_nature.txt', function(data) {
            var nature = data.split("\n");
            var combo = $("#pkNature");
            for (var i = 0; i < nature.length; i++) {
                combo.append($("<option />").text(nature[i]));
            }
        });
    }

    function carregarBall() {

        jQuery.get('res/pk_items_oras.txt', function(data) {
            var balls = data.split("\n");
            var combo = $("#pkBall");
            for (var i = 0; i < 23; i++) {
                combo.append($("<option />").text(balls[i]));
            }
        });
    }

    function resetarEVs() {
        
        $('body').on('click', '#reset', function() {
            $('#pkEVHP').val('');
            $('#pkEVATK').val('');
            $('#pkEVDEF').val('');
            $('#pkEVSPA').val('');
            $('#pkEVSPD').val('');
            $('#pkEVSPE').val('');
        });
    }
    
    function makeDefaultIVEV(){
        
        for (var i = 0; i <= 5; i++) {
            var EVs = ['#pkEVHP', '#pkEVATK', '#pkEVDEF', '#pkEVSPA', '#pkEVSPD', '#pkEVSPE'];
            var IVs = ['#pkIVHP', '#pkIVATK', '#pkIVDEF', '#pkIVSPA', '#pkIVSPD', '#pkIVSPE'];

            if (!$(EVs[i]).val()) {
                $(EVs[i]).val('0');
            }

            if (!$(IVs[i]).val()) {
                $(IVs[i]).val('31');
            }
        }
    }
    
    function setLang() {
        
        var lang = getUserLang();
        $.ajax({
            url: 'res/language.xml',
            success: function(xml) {
                var def = $(xml).find('translations').first().attr('default');
                $(xml).find('translation').each(function(){
                    var id = $(this).attr('id');
                    var text = $(this).find(lang).text();
                    if(!text) {
                        var text = $(this).find(def).text();
                    }
                    $("#" + id).text(text);
                });
            }
        });
    }
    
    function getUserLang() {
        
        var lang = window.navigator.languages ? window.navigator.languages[0] : null;
        lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
        if (lang.indexOf('-') !== -1)
            lang = lang.split('-')[0];
        if (lang.indexOf('_') !== -1)
            lang = lang.split('_')[0];
        return lang;
        
    }
    
    $("form").submit(function(e){
        
        // Impede o submit
        e.preventDefault();
        
        // Converte os valores das inputs para INT
        var hp = parseInt($('#pkEVHP').val());
        var atk = parseInt($('#pkEVATK').val());
        var def = parseInt($('#pkEVDEF').val());
        var spa = parseInt($('#pkEVSPA').val());
        var spd = parseInt($('#pkEVSPD').val());
        var spe = parseInt($('#pkEVSPE').val());

        // Verifica se o total passa do limite (510)
        var total = hp + atk + def + spa + spd + spe;
        if (total > 510) {
            message('warning','ERRO: Total de EVs não pode passar de 510!');
            return;
        }
        
        var flagRepeatedMove = false;
        
        // Verifica se nenhum golpe foi escolhido duas ou mais vezes entre os 4 selects
        for (var i = 0 ; i < 4 ; i++){
            
            var golpe = '#pkMove' + i;
            
            switch (golpe) {
                case '#pkMove1':
                    for(var n = 2 ; n < 5 ; n++){
                        if ($('#pkMove1').val() == $('#pkMove' + n).val()){
                            flagRepeatedMove = true;
                        }
                    }
                    break;
                    
                case '#pkMove2':
                    for(var n = 3 ; n < 5 ; n++){
                        if ($('#pkMove2').val() == $('#pkMove' + n).val()){
                            flagRepeatedMove = true;
                        }else{
                            if ($('#pkMove2').val() == $('#pkMove1').val()){
                            flagRepeatedMove = true;
                            }
                        }
                    }
                    break;
                    
                case '#pkMove3':
                    for(var n = 4 ; n < 5 ; n++){
                        if ($('#pkMove3').val() == $('#pkMove' + n).val()){
                            flagRepeatedMove = true;
                        }else{
                            if ($('#pkMove3').val() == $('#pkMove1').val()){
                            flagRepeatedMove = true;
                            }
                            if ($('#pkMove3').val() == $('#pkMove2').val()){
                            flagRepeatedMove = true;
                            }
                        }
                    }
                    break;
                    
                case '#pkMove4':
                    for(var n = 1 ; n < 4 ; n++){
                        if ($('#pkMove4').val() == $('#pkMove' + n).val()){
                            flagRepeatedMove = true;
                        }
                    }
                    break;
            }
            
            // Tratamento para o Ditto
            if ($('#pkMove2').val() == '(None)' && $('#pkMove3').val() == '(None)' && $('#pkMove4').val() == '(None)') {
                flagRepeatedMove = false;
            }
        }
        
        if (flagRepeatedMove == true) {
            message('danger','ERRO: Golpes duplicados! Verifique os golpes de ' + $('#pkName').val());
            return;
        }
        
        if (flagRepeatedMove == false) {
            makeDefaultIVEV();
        }
        
        if (!$('#pkNickname').val()) {
            $('#pkNickname').val('nonickname');
        }
    
        if ($('#pkBall').val() == null) {
            $('#pkBall').append($("<option/>").text("Poké Ball"));
            $('#pkBall').val('Poké Ball');
        }
    
        var dados =
            $('#pkName').val() + "," +
            $('#pkLevel').val() + "," +
            $('#pkNickname').val() + "," +
            $('#pkNature').val() + "," +
            $('#pkGender').val() + "," +
            $('#pkAbility').val() + "," +
            $('#pkItemORAS').val() + "," +
            $('#pkBall').val() + "," +
            $('#pkShiny').val() + "," +
            $('#pkMove1').val() + "," +
            $('#pkMove2').val() + "," +
            $('#pkMove3').val() + "," +
            $('#pkMove4').val() + "," +
            $('#pkIVHP').val() + "," +
            $('#pkIVATK').val() + "," +
            $('#pkIVDEF').val() + "," +
            $('#pkIVSPA').val() + "," +
            $('#pkIVSPD').val() + "," +
            $('#pkIVSPE').val() + "," +
            $('#pkEVHP').val() + "," +
            $('#pkEVATK').val() + "," +
            $('#pkEVDEF').val() + "," +
            $('#pkEVSPA').val() + "," +
            $('#pkEVSPD').val() + "," +
            $('#pkEVSPE').val();
        
        // Adiciona os valores finais ao Array de Pokés
        pokes.push(dados);
        
        message('success', $('#pkName').val() + " capturado!");
        
        $('#pkName').val('').change(); // Reseta o "Selecionar Pokémon" 
        $('#finalizar').removeAttr('disabled'); // Habilita o botão de finalizar
        $('#pkSprite').attr('src', 'images/transparent.png'); // Adiciona um png transparente no lugar da gifs
        $('.left').append("<img src='http://www.serebii.net/pokedex-xy/icon/" + pkNumber + ".png' style='height: 20px'>"); // Adiciona um ícone de Pokémon à lista de capturados
        $('#desc').text('Preencha os campos e clique em "CAPTURAR" para salvar os dados!'); // Altera o texto da descrição
        // Reseta o select de Gênero
        $('#pkGender').html(''); 
        $('#pkGender').append('<option value="" disabled selected>Gênero</option>');
        $('#pkGender').append('<option value="♂">Macho ♂ </option>');
        $('#pkGender').append('<option value="♀">Fêmea ♀ </option>');
        $('#pkGender').val('');
        $('#pkGender').removeAttr('disabled');
        // Reseta os EVs
        $('#reset').click();
        // Resetas os campos obrigatórios
        $('#pkMove1').removeAttr('disabled');
        $('#pkMove2').removeAttr('disabled');
        $('#pkMove3').removeAttr('disabled');
        $('#pkMove4').removeAttr('disabled');
        $('#pkMove1').html('');
        $('#pkMove1').append('<option value="" disabled selected>Golpe 1</option>');
        $('#pkMove1').val('');
        $('#pkMove2').html('');
        $('#pkMove2').append('<option value="" disabled selected>Golpe 2</option>');
        $('#pkMove2').val('');
        $('#pkMove3').html('');
        $('#pkMove3').append('<option value="" disabled selected>Golpe 3</option>');
        $('#pkMove3').val('');
        $('#pkMove4').html('');
        $('#pkMove4').append('<option value="" disabled selected>Golpe 4</option>');
        $('#pkMove4').val('');
        $('#pkNature').val('');
        $('#pkLevel').val('');
        $('#pkAbility').val('');
        $('#pkItemORAS').val('');
        $('#pkBall').val('');
        $('#pkShiny').val('');
        
    });

    // Evento de tratamento da inputbox de level
    $('#pkLevel').change(function() {
        
        var level = $(this);
        if (parseInt(level.val()) <= 0) {
            level.val('1');
        }
        if (parseInt(level.val()) > 100) {
            level.val('100');
        }
    });

    // Eventos para tratar as inputboxes de EVs
    $('#pkEVHP').change(function() {
        
        var HP = $(this);
        if (parseInt(HP.val()) < 0) {
            HP.val('0');
        }
        if (parseInt(HP.val()) > 252) {
            HP.val('252');
        }
    });
    $('#pkEVATK').change(function() {
        
        var ATK = $(this);
        if (parseInt(ATK.val()) < 0) {
            ATK.val('0');
        }
        if (parseInt(ATK.val()) > 252) {
            ATK.val('252');
        }
    });
    $('#pkEVDEF').change(function() {
        
        var DEF = $(this);
        if (parseInt(DEF.val()) < 0) {
            DEF.val('0');
        }
        if (parseInt(DEF.val()) > 252) {
            DEF.val('252');
        }
    });
    $('#pkEVSPA').change(function() {
        
        var SPA = $(this);
        if (parseInt(SPA.val()) < 0) {
            SPA.val('0');
        }
        if (parseInt(SPA.val()) > 252) {
            SPA.val('252');
        }
    });
    $('#pkEVSPD').change(function() {
        
        var SPD = $(this);
        if (parseInt(SPD.val()) < 0) {
            SPD.val('0');
        }
        if (parseInt(SPD.val()) > 252) {
            SPD.val('252');
        }
    });
    $('#pkEVSPE').change(function() {
        
        var SPE = $(this);
        if (parseInt(SPE.val()) < 0) {
            SPE.val('0');
        }
        if (parseInt(SPE.val()) > 252) {
            SPE.val('252');
        }
    });
    
    // Evento para Finalizar
    $('#finalizar').click(function(){
        
        var csv = "";
        // Adiciona cada linha do array de pokés com /n em csv
        csv = pokes.join("\r\n"); 
        // Cria o arquivo e realiza o donwload
        var uri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "Pokélist.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
    });
    
    // Evento para shinyficar
    $('#pkShiny').change(function() {
        
        if ($('#pkShiny').val() == 'shiny') {
            $('#pkSprite').attr('src', 'images/shinysprite/' + pkDex + '.gif');
        }else{
            $('#pkSprite').attr('src', 'images/normalsprite/' + pkDex + '.gif');
        }
    })

    // Evento para carregar golpes e habilidades
    $('#pkName').change(function() {
        
        var pokemon = $(this).find("option:selected").text();
        if (pokemon == 'Selecione o Pokémon') return; // Tratamento pós "Capturar"
    
        // Reseta todos os componentes obrigatórios
        $('#pkMove1').removeAttr('disabled');
        $('#pkMove2').removeAttr('disabled');
        $('#pkMove3').removeAttr('disabled');
        $('#pkMove4').removeAttr('disabled');
        $('#pkLevel').val('');
        $('#pkNature').val('');
        $('#pkGender').html(''); 
        $('#pkGender').append('<option value="" disabled selected>Gênero</option>');
        $('#pkGender').append('<option value="♂">Macho ♂ </option>');
        $('#pkGender').append('<option value="♀">Fêmea ♀ </option>');
        $('#pkGender').removeAttr('disabled');
        $('#pkGender').val('');
        $('#pkItemORAS').val('');
        $('#pkBall').val('');
        $('#pkShiny').val('');
        $('#pkEVHP').val('');
        $('#pkEVATK').val('');
        $('#pkEVDEF').val('');
        $('#pkEVSPA').val('');
        $('#pkEVSPD').val('');
        $('#pkEVSPE').val('');
        $('#pkAbility').val('');
        $('#pkMove1').html('');
        $('#pkMove1').append('<option value="" disabled selected>Golpe 1</option>');
        $('#pkMove1').val('');
        $('#pkMove2').html('');
        $('#pkMove2').append('<option value="" disabled selected>Golpe 2</option>');
        $('#pkMove2').val('');
        $('#pkMove3').html('');
        $('#pkMove3').append('<option value="" disabled selected>Golpe 3</option>');
        $('#pkMove3').val('');
        $('#pkMove4').html('');
        $('#pkMove4').append('<option value="" disabled selected>Golpe 4</option>');
        $('#pkMove4').val('');
        $('#pkNickname').val('').css('visibility', 'hidden');
        $('.nickname').removeAttr('disabled');
        $('#capturar').removeAttr('disabled');
        
        function pkGender(){
            $('#pkGender').html('');
            $('#pkGender').append('<option value="none">Sem gênero</option>');
            $('#pkGender').val('none');
            $('#pkGender').attr('disabled','true');
        }
        var pokemons = [
            'Electrode','Magnemite','Magneton','Porygon','Stary','Starmie','Voltorb','Porygon2','Baltoy', 
            'Beldum','Metang','Metagross','Claydol','Lunatone','Solrock','Bronzong','Bronzor','Magnezone',
            'Porygon-Z','Rotom','Bronzor','Carbink','Cryogonal','Gollet','Golurk','Klang','Kling',
            'Klingklang','Shedinja'
        ];

        pokemons.forEach(function(item){
            if(pokemon == item){
                pkGender();
            }
        });

        // AJAX para carregar as habilites do Pokémon
        var url = "http://pokeapi.co/api/v1/pokemon/" + pokemon.toLowerCase(); //Acessa a URL passando o nome do pokémon em lowercase
        var url2 = "http://pokemondb.net/pokedex/" + pokemon.toLowerCase();
        
        $.ajax({
            url: url,
            dataType: 'jsonp', // 'jsonp' é necessário pelo fato de estar fazendo um acesso cross-domain
            beforeSend: function(){
              $('#pkSprite').hide();
              $('#loading').show();  
            },
            success: function(data) {
                
                // Carrega o número da National Dex
                pkNumber = data.national_id;
                // Converte a pattern do número para '000'
                pkNumber = pad(pkNumber,3);
                
                pkDex = pokemon.toLowerCase();
                $('#pkSprite').attr('src', 'images/normalsprite/' + pkDex + '.gif').hide();

                // Preenche as 4 combobox de golpes
                $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url2) + '&callback=?', function(data){
                    
                    var moves = new Array();
                    var pokeDb = $('<div/>').html(data.contents).contents();
                    
                    //pokeDb.find('#svtabs_moves_14').find("h2:containsNC('move')").not(":containsNC('transfer-only')").parent().find('.data-table').find('tbody').find('tr').each(function(){
                    pokeDb.find('#svtabs_moves_14').find("h2:containsNC('move')").not(":containsNC('transfer-only')").parent().find('.data-table').find('tbody').find('tr').find('.cell-icon-string').each(function(){
                        var move = $(this).text();
                        moves.push(move);
                    });
                    
                    // Tratamento de gênero e ataques para o Ditto
                    if (pokemon == 'Ditto') {
                        
                        pkGender();
                        
                        $('#pkMove1').html('');
                        $('#pkMove1').append('<option value="Transform">Transform</option>');
                        $('#pkMove1').val('Transform');
                        $('#pkMove1').attr('disabled','true');
                        
                        for(i = 2 ; i < 5 ; i++){
                            $('#pkMove'+ i).html('');
                            $('#pkMove'+ i).append('<option value="(None)">(None)</option>');
                            $('#pkMove'+ i).val('(None)');
                            $('#pkMove'+ i).attr('disabled','true')
                        }
                        
                        $('#loading').hide();
                        $('#pkSprite').show();
                    
                    }else{
                        
                        for (var n = 1; n <= 4; n++) {
                            var cmb = "#pkMove" + [n];
                            var combo = $(cmb);
                            
                            // FOR invertido para limpar select de golpes (inicia do final)
                            var opts = combo[0].options;
                            for (var i = opts.length; i--; ) {
                                if(i == 0)continue;
                                opts[i].remove();
                            }
                            
                        for (var i = 0; i < moves.length; i++) {
    
                            var move = moves[i];
                            // Regex para formatar o nome do golpe pra inicial maiúscula e tirar os traços que são trazidos pelo JSON da PokeAPI
                            move = move.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                                return letter.toUpperCase();
                            });
                            move = move.replace(/-/g, " ");
                            
                            // Tratamento para golpes com hífen
                            switch (move) {
                                
                                case 'Will O Wisp':
                                    move = move.replace(/[\s\r\n]+/gim,'-');
                                    break;
                                
                                case 'Wild Charge':
                                    move = move.replace(" ","-");
                                    break;
                                
                                case 'Self Destruct':
                                     move = move.replace(" ","-");
                                    break;
                                    
                                case 'Soft Boiled':
                                     move = move.replace(" ","-");
                                    break;
                                    
                                case 'Mud Slap':
                                     move = move.replace(" ","-");
                                    break;
                                    
                                case 'Lock On':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'X Scissor':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'V Create':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'Trick Or Treat':
                                    move = move.replace(/[\s\r\n]+/gim,'-');
                                    break;
                                    
                                case 'Freeze Dry':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'Topsy Turvy':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'Double Edge':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'Power Up Punch':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'Baby Doll Eyes':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'Wake Up Slap':
                                    move = move.replace(" ","-");
                                    break;
                                    
                                case 'U Turn':
                                    move = move.replace(" ","-");
                                    break;
                                
                                default:
                                    break;
                            }
                            
                            combo.append($("<option />").text(move)); // Adiciona o golpe como option no select
                        }
                            
                        $('#loading').hide();
                        $('#pkSprite').show();
                        
                        }
                    } 
                });

                // Preenche as combobox de habilidade
                var comboability = $('#pkAbility');
                
                // FOR invertido para limpar select de habilidade (inicia do final)
                var opts = comboability[0].options;
                for (var i = opts.length; i--; ) {
                    if(i == 0)continue;
                    opts[i].remove();
                }
                
                for (var n = 0; n < data.abilities.length; n++) {
                    
                    var ability = data.abilities[n].name;
                    // Regex para formatar o nome do habilidade
                    ability = ability.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                        return letter.toUpperCase();
                    });
                    // Regex para retirar o traço
                    ability = ability.replace(/-/g, " ");

                    comboability.append($("<option />").text(ability));
                }
            }
             
        });

    });

    // Evento para adicionar (em real-time) o nome do pokémon escolhido ao input de apelido
    $('#pkName').change(function() {
        
        var val = $(this).find("option:selected").text();
        $('#pkNickname').attr("placeholder", "Coloque aqui o apelido de " + val);
        
    });

    // Evento para alterar o cabeçalho
    $('#pkName').change(function() {
        
        var val = $(this).find("option:selected").text();
        $('#greet').text(val);
        $('#desc').text("Não sabe preencher IVs e EVs? Deixe em branco! :)");
        
    });

    // Adiciona a caixa de apelido ao clicar no botão
    $('body').on('click', '.nickname', function() {
        
        $('#pkNickname').css("visibility", "visible").focus();
        $('#pkNickname').attr("pattern", "[A-Za-z]{1,12}");
        $('.nickname').attr("disabled", "true");
        
    });

    // Maximiza todos os IVs para 31
    $('body').on('click', '#max', function() {
        
        $('#pkIVHP').val("31");
        $('#pkIVATK').val("31");
        $('#pkIVDEF').val("31");
        $('#pkIVSPA').val("31");
        $('#pkIVSPD').val("31");
        $('#pkIVSPE').val("31");
        
    });

    // Resetar os EVs através do clique na badge RESET
    $("#reset").on('click', resetarEVs());
    
    // $('#donwload').click(function() {
        
//       jQuery.get('res/pk_name.txt', function(data) {

//             var pkmns = data.split("\n");
            
//             for (var n in pkmns){
//             	var name = pkmns[n];
// 				var a = $("<a>")
// 			    .attr("href", "http://www.pokestadium.com/sprites/xy/shiny/"+name.toLowerCase()+".gif")
// 			    .attr("download", name+".png")
// 			    .appendTo("body");

// 				a[0].click();

// 				a.remove();
// 			}
//         }); 
//     });
    
    setLang();
    carregarPokes();
    carregarItemOras();
    carregarNature();
    carregarBall();
    $.extend($.expr[":"], {
        "containsNC": function(elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
    
});