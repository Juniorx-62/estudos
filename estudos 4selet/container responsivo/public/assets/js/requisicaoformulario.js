//Modifica o comportamento padrão do Bootstrap Validation
$.fn.validator.Constructor.DEFAULTS.disable = false;

function MostrarLoad(){
    if($('#loader-wrapper').length) {
        $('#loader-wrapper').removeClass('stopped');
    } else {
        $('body').append('<div id="loader-wrapper"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>');
    }
    //console.log("Mostrando mensagem de load");
}

function PararLoad(ObjLoad){
    $('#loader-wrapper').addClass('stopped');
    //console.log("Parando mensagem de load");
}

function MostrarSucesso(RetornoSucessoAPI, funcaoAceite){
    // console.log("Atividade realizada com sucesso");
}

function MostrarErro(RetornoErroAPI, mensagemError = '', type = null){
    // console.log("Atividade realizada com erros");
    // console.log('RetornoErroAPI', RetornoErroAPI.status);

    if(mensagemError == ''){
        let mensagemErroText = '';

        const errMsgIsUndef = msg => (msg === undefined || msg === "undefined" || msg === "null");

        if(!errMsgIsUndef(RetornoErroAPI.responseJSON) && !errMsgIsUndef(RetornoErroAPI.responseJSON.mensagenserro) && RetornoErroAPI.responseJSON.mensagenserro.length > 0) {
            $.each(RetornoErroAPI.responseJSON.mensagenserro, function(i, item){
                if (!errMsgIsUndef(item))
                    mensagemErroText += '<p>'+item+'</p>';
            });
        } else if(!errMsgIsUndef(RetornoErroAPI.responseJSON) && !errMsgIsUndef(RetornoErroAPI.responseJSON.message)) {
            if (RetornoErroAPI.status === 403) {
                mensagemErroText = '<p>Você não tem permissão para realizar esta ação.</p>';
            } else {
                mensagemErroText = '<p>'+RetornoErroAPI.responseJSON.message+'</p>';
            }
        } else if (RetornoErroAPI.status === 413) {
            mensagemErroText = '<p>Não foi possível realizar o upload do arquivo. <br> Ele ultrapassa o limite de upload máximo permitido.</p>';
        }

        if(!type) {
            Swal.fire({
                title: 'Erro!'
                , html: mensagemErroText
                , icon: 'error'
                , confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Atenção!'
                , html: mensagemErroText
                , icon: 'warning'
                , confirmButtonText: 'OK'
            });
        }

    } else {
        if(!type) {
            Swal.fire({
                title: 'Erro!'
                , html: mensagemError
                , icon: 'error'
                , confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Atenção!'
                , html: mensagemError
                , icon: 'warning'
                , confirmButtonText: 'OK'
            });
        }
    }
}

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

jQuery(function($){
    function executarAtribuicoesFormulario(form, result = null) {
        if(form.attr('data-back') !== undefined && form.attr('data-back') !== '') {
            window.location = document.referrer;
        } else if(form.attr("data-reload") !== undefined && form.attr('data-reload') !== '') {
            window.location.reload();
        } else if(form.attr("data-redirect") !== undefined && form.attr('data-redirect') !== '') {
            window.location = form.attr("data-redirect");
        } else if(form.attr("data-redirectkey") !== undefined && form.attr('data-redirectkey') !== '' && result['key'] != null && result['key'] !== '' && result['key'] !== '00000000-0000-0000-0000-000000000000') {
            window.location = form.attr("data-redirectkey") + '/' + result['key'];
        } else if(form.attr("data-redirectreturn") !== undefined && form.attr('data-redirectreturn') !== '' && result['redirect'] !== '') {
            window.location = result['redirect'];
        }
    }

    function executaSubmitFormulario(form) {
        var data = form.serialize();

        let processData = true;
        let contentType = 'application/x-www-form-urlencoded; charset=UTF-8';

        if (form.attr('data-processdata') !== undefined && form.attr('data-processdata') == false && form.attr('data-contenttype') !== undefined && form.attr('data-contenttype') == false) {
            data = new FormData(form[0]);
            processData = false;
            contentType = false;
        }

        var load = MostrarLoad();

        $.ajax({
            url: form.attr('action'),
            data: data,
            dataType: 'JSON',
            processData: processData,
            contentType: contentType,
            type: form.attr('method'),
            success: function(result){
                PararLoad(load);
                // MostrarSucesso(result);
                if(
                    ((form.attr('data-msgsuccess') !== undefined && form.attr('data-msgsuccess') !== '') ||
                    (form.attr('data-titleSuccess') !== undefined && form.attr('data-titleSuccess') !== '')) &&
                    (form.attr('data-toast') == undefined || form.attr('data-toast') == '' || form.attr('data-toast') == null || form.attr('data-toast') == 'false')
                )
                {
                    Swal.fire({
                        title: form.attr('data-titleSuccess'),
                        text: form.attr('data-msgsuccess'),
                        icon: "success",
                        type: "success"
                    }).then(function() {
                        executarAtribuicoesFormulario(form, result);
                    });
                } else if (form.attr('data-toast') !== undefined && form.attr('data-toast') !== '') {
                    Toast.fire({
                        icon: "success",
                        title: form.attr('data-msgsuccess'),
                    });
                    $('button[data-bs-dismiss="modal"]').click();
                } else if(result.mensagenserro.length != 0) {
                    let texto = '';
                    result.mensagenserro.forEach(element => {
                        texto += element + '<br>';
                    });

                    Swal.fire({
                        title: "Atenção",
                        html: texto,
                        icon: "info",
                        type: "success"
                    }).then(function() {
                        executarAtribuicoesFormulario(form, result);
                    });
                } else {
                    executarAtribuicoesFormulario(form, result);
                }
            },
            error: function(err, resp, text) {
                PararLoad(load);
                MostrarErro(err);
            }
        });
    }

    if ($(".formValidate").length) {
        $.each($(".formValidate"), function () {
            $(this).validator({
                disable: false
            });
        });
    }

    $('.formAjax').on('submit', function(e){
        var form = $(this);
        if(form.attr('noprocess') !== undefined && form.attr('noprocess') !== ''){
            return true;
        }
        e.preventDefault();

        if((form.hasClass('formValidate') && !form.find('.has-error').length) || !form.hasClass('formValidate')) {
            if(form.attr('data-needConfirm') !== undefined && form.attr('data-needConfirm') !== ''){
                var confirmText, confirmButtonText = '';

                if(form.attr('data-confirmText') !== undefined && form.attr('data-confirmText') !== ''){
                    confirmText = form.attr('data-confirmText');
                } else {
                    confirmText = "Deseja realmente excluir este item?";
                }

                if(form.attr('data-confirmButtonText') !== undefined && form.attr('data-confirmButtonText') !== ''){
                    confirmButtonText = form.attr('data-confirmButtonText');
                } else {
                    confirmButtonText = "Excluir item";
                }

                if(form.attr('data-inputTextarea') !== undefined && form.attr('data-inputTextarea') !== ''){
                    Swal.fire({
                        title: 'Atenção!',
                        icon: 'info',
                        showCancelButton: true,
                        text: confirmText,
                        confirmButtonText: confirmButtonText,
                        inputPlaceholder: "Escreva o motivo aqui...",
                        input: 'textarea',
                        focusConfirm: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            form.append('<input type="hidden" name="description" value="'+result.value+'">');
                            executaSubmitFormulario(form);
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Atenção!',
                        text: confirmText,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: confirmButtonText,
                        cancelButtonText: 'Cancelar',
                        focusConfirm: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            executaSubmitFormulario(form);
                        }
                    })
                }
            } else {
                executaSubmitFormulario(form);
            }
        }

    });
});
