function Login(urlLogin){
    var email = $("#email").val();
    var senha = $("#senha").val();
    var load = MostrarLoad();
    $.ajax({
        url: urlLogin,
        data: {
            user: email,
            password: senha,
            produto_id: $("#produto_principal_id").val()
        },
        dataType: "JSON",
        type: "POST",
        success: function (result) {
            $("#token_api").val(result.token);
            PararLoad(load);
            PassarProximoEstagio(5, 6);
        },
        error: function (err, resp, text) {
            PararLoad(load);
            MostrarErro(err);
        },
    });
}

function RenovacaoSucessoTokenCartao(data) {
    $("#tokencartao").val(data["munditoken-0"]);
    RenovacaoRealizaCompra($("#formCreditCard").data("urlpagamento"));
    return false;
}

function RenovacaoFalhaTokenCartao(error) {
    $("#tokencartao").val("");
    PararLoad();
    mensagemErroCartao();
}

function mensagemErroCartao() {
    Swal.fire({
        title: "Erro!",
        html: `<p>Cartão inválio. Valide os dados e tente novamente</p>`,
        icon: "error",
        confirmButtonText: "OK",
    });
}


function RenovacaoRealizaCompra(urlSubmissao) {
    var data = $('form*[data-stage="5"]').serialize();
    data += "&" + $('form*[data-stage="6"]').serialize();
    $.ajax({
        url: urlSubmissao,
        data: data,
        dataType: "JSON",
        type: "POST",
        success: function (result) {
            PararLoad();
            MostrarSucesso(result);
            window.location.replace(result.id.url_retorno);
            //redirecionar compra
        },
        error: function (err, resp, text) {
            PararLoad();
            MostrarErro(err);
        },
    });
}

$(document).ready(function(){
    $(".form-login").on("submit", function (e) {
        e.preventDefault();
        Login($(this).data("urllogin"));
    });

    $(".pagamento-renovacao").on("submit", function (e) {
        e.preventDefault();
        RenovacaoRealizaCompra($("#formCreditCard").data("urlpagamento"));
    });
});
