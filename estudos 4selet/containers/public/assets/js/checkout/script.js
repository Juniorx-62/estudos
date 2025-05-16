//Modifica o comportamento padrão do Bootstrap Validation
$.fn.validator.Constructor.DEFAULTS.disable = false;

$(function () {
    $("a.page-scroll").bind("click", function (event) {
        var $anchor = $(this);
        $("html, body")
            .stop()
            .animate(
                {
                    scrollTop: $($anchor.attr("href")).offset().top,
                },
                1000,
                "easeInOutExpo"
            );
        event.preventDefault();
    });
});

jQuery(document).ready(function ($) {
    if ($(".formValidate").length) {
        $.each($(".formValidate"), function () {
            $(this).validator({
                excluded: [':disabled'] // Remove ':hidden' da lista de exclusões
            });
        });
    }

    if ($("input[data-mask]").length) {
        $.each($("input[data-mask]"), function (i, o) {
            var $o = $(o),
                reverse = $o.attr("data-mask-reverse") == "true" ? true : false;
            $o.mask($o.attr("data-mask"), {
                reverse: reverse,
            });
            delete $o;
        });
    }

    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    function updateScroll() {
        var scroll = $(window).scrollTop();

        if (scroll >= 50) {
            $(".navbar-update-scroll").addClass("navbar-shrink");
        } else {
            $(".navbar-update-scroll").removeClass("navbar-shrink");
        }
    }

    updateScroll();

    $(window).scroll(function () {
        updateScroll();
    });

    function buscaCep() {
        if ($.trim($("input[name=zipcode]").val()) != "") {
            // $("#alertaBuscaCep").hide();

            $.getJSON("https://viacep.com.br/ws/" + $("input[name=zipcode]").val().replace(".", "") + "/json/",
                function (dados) {
                    if (!("erro" in dados)) {
                        // $(".contentCep").collapse("show");
                        $("input[name=street]").val(
                            dados.logradouro
                        );
                        $("input[name=neighborhood]").val(dados.bairro);
                        $("input[name=city]").val(dados.localidade);
                        $("input[name=state]").val(dados.uf);
                        $("input[name=number]").val('s/n');
                    } else {
                    }
                }
            );
        } else {
            $("input[name=zipcode]").focus();
        }
    }

    $(".buscaCep button").bind("click", function (event) {
        buscaCep();
    });

    $("input[name=zipcode]").on("change", function (event) {
        buscaCep();
    });

    if ($(".adicionar-oferta").length) {
        $(".adicionar-oferta label").bind("click", function (event) {
            if ($(this).find($("input")).is(':checked')) {
                $(".adicionar-oferta label input").prop('checked', true);
                $("#col-sidebar").removeClass("col-xl-3 col-lg-4");
                $("#col-sidebar").addClass("col-xl-4 col-lg-5");
                $(".box-produto").hide();
                $(".box-pedido").show();
                if ($("#parecelasselect").length) {
                    var parcelasSelecionadas = $("#parecelasselect").val();
                    $("#parecelasselect").html($("#parcelas_produto_principal_order_bump").html());
                    $("#parecelasselect").val(parcelasSelecionadas).change();
                }
                $("#produtos_id_order_bump").val($(this).find('input').data('idproduto'));
            } else {
                $(".adicionar-oferta label input").prop('checked', false);
                $("#col-sidebar").removeClass("col-xl-4 col-lg-5");
                $("#col-sidebar").addClass("col-xl-3 col-lg-4");
                $(".box-pedido").hide();
                $(".box-produto").show();
                if ($("#parecelasselect").length) {
                    var parcelasSelecionadas = $("#parecelasselect").val();
                    $("#parecelasselect").html($("#parcelas_produto_principal").html());
                    $("#parecelasselect").val(parcelasSelecionadas).change();
                }
                $("#produtos_id_order_bump").val('');
            }
        });
    }

    if ($("#parecelasselect").length) {
        $("#parecelasselect").on('change', function () {
            $("#cart_valor_total").html($("#parecelasselect option:selected").text());
        });
    }

    $("input[name='metodo-pagamento']").on('change', function () {
        $("#cart_valor_total").hide();
        if ($(this).val() == "cartao-credito") {
            $("#cart_valor_total").show();
        }
    });

    if ($("#formCreditCard").length && $(".card-wrapper").length) {
        new Card({
            form: document.querySelector("#formCreditCard"),
            container: ".card-wrapper",
            formSelectors: {
                numberInput: '#number', // optional — default input[name="number"]
                expiryInput: '#expiry', // optional — default input[name="expiry"]
                cvcInput: '#cvv', // optional — default input[name="cvc"]
                nameInput: '#holder_name' // optional - defaults input[name="name"]
            }
        });
    }

    var url = new URL(window.location.href);
    if (url.searchParams.get('phone') != null) {
        var parame = url.searchParams.get('phone');
        var telefone = parame.replace(
            /(\d{2})(\d{1})(\d{4})(\d{4})/,
            "($1) $2 $3-$4"
        );
        $("#telefone").val(telefone);
    }

    $("#formCreditCard").on('submit', function(e){
        e.preventDefault();
        var data = $(this).serialize();
        var load = MostrarLoad();

        $.ajax({
            url: $(this).attr('action'),
            data: data,
            dataType: 'JSON',
            type: $(this).attr('method'),
            success: function(result){
                PararLoad(load);
                // console.log(result);
                window.location.replace(result.redirect);
            },
            error: function(err, resp, text) {
                PararLoad(load);
                MostrarErro(err);
            }
        });
    });
});

function openTab(evt, tabName) {
    var i, tabpane, tablinks;
    tabpane = document.getElementsByClassName("tabpane");
    for (i = 0; i < tabpane.length; i++) {
        tabpane[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    if($('#' + tabName).length) {
        document.getElementById(tabName).style.display = "block";
    }
    evt.currentTarget.className += " active";
    $("#metodo-pagamento").val(tabName);
}

function IntegracaoFacebook(acao, data = [], track = 'track') {
    if (typeof fbq === "function") {
        fbq(track, acao, data);
    }
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

$(document).ready(function() {
    $('[data-holder-name]').each(function() {
      $(this).on('input', function() {
        let originalValue = $(this).val();
        let newValue = removeAccents(originalValue).toUpperCase();
        $(this).val(newValue);
      });
    });
});