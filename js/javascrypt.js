//valida formulario
(() => {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()



// valida cep

function msg_cep(msg) {
    id = "valida_cep"
    document.getElementById(id).textContent = msg
}

function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    // document.getElementById('cidade').value = ("");
    $("#cidade").html('<option value="">Antes escolha o UF</option>');
    document.getElementById('uf').value = ("");
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        // document.getElementById('cidade').value = (conteudo.localidade);
        $("#cidade").html('<option value="' + conteudo.localidade + '">' + conteudo.localidade + '</option>');
        document.getElementById('uf').value = (conteudo.uf);
        // document.getElementById('ibge').value = (conteudo.ibge);
        msg_cep("");
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        msg_cep("CEP não encontrado.");
    }
}

function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.

            document.getElementById('rua').value = "";
            document.getElementById('bairro').value = "";
            // document.getElementById('cidade').value = "...";
            $("#cidade").html('<option value=""></option>');
            document.getElementById('uf').value = "";
            // document.getElementById('ibge').value = "";
            msg_cep("");
            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            msg_cep("");
            limpa_formulário_cep();
            // alert("Formato de CEP inválido.");
            document.getElementById("valida_cep").textContent = "CEP inválido.";
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
        msg_cep("Informe o cep");
    }
};

//busca estados_cidades

$(document).ready(function () {
    $.getJSON('http://mendesepereira.neuroteks.com/entrevista/estados_cidades.json', (data) => {
        let items = [];
        let options = 'Selecione a UF';

        for (val of data) {
            options += '<option value="' + val.sigla + '">' + val.sigla + " - " + val.nome + '</option>';
        }

        $("#uf").html(options);

        $("#uf").change(() => {
            let options_cidades = '<option>Selecione a Cidade</option>';
            let str = $("#uf").val();

            for (val of data) {
                if (val.sigla == str) {
                    for (val_city of val.cidades) {
                        options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                    }
                }
            }

            $("#cidade").html(options_cidades);
        }).change();

    });

    $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados/', { id: 10, }, function (json) {

        var options = '<option value="">Escolha um uf</option>';

        for (var i = 0; i < json.length; i++) {

            options += '<option data-id="' + json[i].id + '" value="' + json[i].sigla + '" >' + json[i].sigla + '</option>';

        }
        $("#uf").html(options);
        // $("select[name='estado']").html(options);

    });


    $("#uf").change(function () {

        if ($(this).val()) {
            $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + $(this).find("option:selected").attr('data-id') + '/municipios', { id: $(this).find("option:selected").attr('data-id') }, function (json) {

                var options = '<option value="">Escolha a Cidade</option>';

                for (var i = 0; i < json.length; i++) {

                    options += '<option value="' + json[i].nome + '" >' + json[i].nome + '</option>';

                }
                $("#cidade").html('<select>' + options + '</select>');

                // $("select[name='cidade']").html(options);

            });

        } else {

            $("#cidade").html('<option value=""></option>');

            // $("select[name='cidade']").html('<option value="">–  –</option>');

        }

    });

});


//mask 

VMasker(document.getElementById("celular")).maskPattern('(99) 9 9999-9999')
VMasker(document.getElementById("tel_fixo")).maskPattern('(99) 9999-9999')
VMasker(document.getElementById("cep")).maskPattern('99.999-9999')


//doses
function disable(doses, bool) {
    doses.forEach(function (dose_id) {
        desativa_ativar(dose_id, bool)
    })
}

function desativa_ativar(dose_id, bool) {
    var doses = document.getElementsByName(dose_id)

    doses.forEach(function (dose) {
        dose.disabled = bool;
        if(bool){
            dose.checked = !bool;
        }
       
    });
}