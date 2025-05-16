function getBase64(file, callbacksuccess, callbackerror) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = callbacksuccess;
    reader.onerror = callbackerror;
}

function uploadPhoto64(e, inputfile, inputphoto, inputmime, pathloadimage) {
    var file = e.target.files[0];
    getBase64(file, loaded, errorfunc);
    function loaded(e) {
        var fileString = e.target.result;
        var part_one = fileString.split("data:")[1];
        var type_mime = part_one.split(";base64")[0];
        var splited = fileString.split("base64,");
        $(inputphoto).val(splited[1]);
        $(inputmime).val(type_mime);
        if (pathloadimage) {
            $(pathloadimage).attr('src', fileString);
        }
    }
    function errorfunc(e) {
        // console.log("Error base64 image", e.target.error);
    }
}

jQuery(function ($) {
    $('.btn_dark_mode').on('click', function () {
        $('body').addClass('dark');
    });
    $('.btn_light_mode').on('click', function () {
        $('body').removeClass('dark');
    });
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    if ($('input[data-mask]').length) {
        $.each($("input[data-mask]"), function (i, o) {
            var $o = $(o),
                reverse = (($o.attr("data-mask-reverse") == "true") ? true : false);
            $o.mask($o.attr("data-mask"), {
                reverse: reverse
            });
            delete $o;
        });
    }
    if ($('input[data-mask-money]').length) {
        $.each($("input[data-mask-money]"), function (i, o) {
            var prefix = '';
            var suffix = '';
            var precision = 2;
            if ($(this).attr("data-mask-money-prefix") != '') {
                prefix = $(this).attr("data-mask-money-prefix");
            }

            if ($(this).attr("data-mask-money-suffix") != '') {
                suffix = $(this).attr("data-mask-money-suffix");
            }

            if ($(this).attr("data-mask-money-precision") != '') {
                precision = parseInt($(this).attr("data-mask-money-precision"));
            }

            $(this).maskMoney({ prefix: prefix, suffix: suffix, decimal: ",", thousands: ".", allowNegative: false, precision: precision });
        });
    }
    if ($(window).width() <= 768) {
        $(".page-wrapper").removeClass("toggled");
    }

    var settingsSelect2 = {
        theme: 'bootstrap-5',
        "language": {
            "noResults": function () {
                return "Nenhum resultado encontrado";
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    };

    const selectedValues = {};

    window.initializeTomSelect = function() {
        $('.tom-select').each(function () {
            const selectElement = this;
            const createOption = $(selectElement).data('create') || false;
            const openOnFocus = $(selectElement).data('open-on-focus') || true;
            // Aqui pegamos o array de códigos com as opções que devem vir selecionadas
            const selectedOptions = $(selectElement).data('selected-options') || [];

            // Cria a instância do TomSelect e a armazena em uma variável
            const instance = new TomSelect(selectElement, {
                plugins: ['remove_button'],
                create: createOption,
                openOnFocus: openOnFocus,
                onItemAdd: function (value) {
                    const selectName = selectElement.name;
                    if (!selectedValues[selectName]) {
                        selectedValues[selectName] = [];
                    }
                    if (!selectedValues[selectName].includes(value)) {
                        selectedValues[selectName].push(value);
                    }
                },
                onItemRemove: function (value) {
                    const selectName = selectElement.name;
                    if (selectedValues[selectName]) {
                        selectedValues[selectName] = selectedValues[selectName].filter(v => v !== value);
                    }
                },
                render: {
                    option: function (data, escape) {
                        return '<div class="d-flex"><span class="text-muted">' + escape(data.text) + '</span></div>';
                    },
                    item: function (data, escape) {
                        return '<div>' + escape(data.text) + '</div>';
                    }
                }
            });

            // Após a criação, seleciona os itens com base no array recebido
            instance.setValue(selectedOptions);
        });
    };

    initializeTomSelect();

    if ($.isFunction($.fn.datepicker)) {
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy',
            showOtherMonths: true,
            selectOtherMonths: true,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        });
    }

    if ($('.datetimepicker').length) {
        jQuery.datetimepicker.setLocale('pt-BR');

        $.each($('.datetimepicker'), function () {
            $(this).datetimepicker({
                format: "d/m/Y H:i",
                scrollMonth : false,
                scrollInput : false
            });
        });
    }

    if ($('.datepicker').length) {
        jQuery.datetimepicker.setLocale('pt-BR');

        $.each($('.datepicker'), function () {

            var maxDate = false;
            if ($(this).attr("maxDate") && $(this).attr("maxDate") != '') {
                maxDate = $(this).attr("maxDate");
            }

            $(this).datetimepicker({
                format: "d/m/Y",
                timepicker: false,
                maxDate: maxDate,
                crollMonth : false,
                scrollInput : false
            });
        });
    }

    function SetaCronometro(campo, valor) {
        if (valor.toString().length == 1) {
            valor = "0" + valor;
        }
        $('#' + campo).html(valor);
    }
    function CalcularNovoCronometro(campo) {
        subtrai1 = false;
        $segundo = parseInt($("#" + campo).html());
        $segundo -= 1;
        if ($segundo < 0) {
            $segundo = 59;
            subtrai1 = true;
        }
        SetaCronometro(campo, $segundo);
        return subtrai1;
    }
    if ($('.contegam-regressiva').length > 0) {
        setInterval(function () {
            if (CalcularNovoCronometro('qtd-segundos')) {
                if (CalcularNovoCronometro('qtd-minutos')) {
                    if (CalcularNovoCronometro('qtd-horas')) { }
                }
            }
        }, 1000);
    }

    if ($('.date-mask').length) {
        $('.date-mask').each(function () {
            $(this).mask("00/00/0000");
        });
    }

    $('.groupFilePhoto').each(function () {
        var elementCentral = $(this);
        elementCentral.find('.btn-photo').on('click', function () {
            elementCentral.find('.file-photo').trigger('click');
        });

        elementCentral.find('.file-photo').on('change', function (event) {
            var filePhoto = elementCentral.find('.file-photo');
            var pathPhoto = elementCentral.find('.path-photo');
            var typePhoto = elementCentral.find('.type-photo');
            var boxPhoto = elementCentral.find('.box-photo');

            uploadPhoto64(event, filePhoto, pathPhoto, typePhoto, boxPhoto);
        });
    });

    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });

    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
    });

    window.initializeDateRangePicker = function(value, maxDateValue, minDateValue, elementId) {
        var $elements = elementId ? $(elementId) : $('.daterange');

        if ($elements.length) {
            $.each($elements, function () {
                const showRanges = $(this).data("showranges");
                const urlSearch = $(this).data("urlsearch");
                const $input = $(this);
                const singleDatePicker = $(this).data("singledatepicker");
                const timePicker = $(this).data("timepicker");
                const timePickerSeconds = $(this).data("timepickerseconds");
                var urlParams = new URLSearchParams(window.location.search);
                var urlStartDate = urlParams.get('start_date');
                var urlEndDate = urlParams.get('end_date');

                const dateFormat = timePicker
                    ? (timePickerSeconds ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm")
                    : "DD/MM/YYYY";

                let options = {
                    locale: {
                        format: dateFormat,
                        separator: " - ",
                        applyLabel: "Aplicar",
                        cancelLabel: "Cancelar",
                        customRangeLabel: "Personalizado",
                        daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
                    },
                    alwaysShowCalendars: true,
                    startDate: urlStartDate
                        ? moment(urlStartDate, "DD/MM/YYYY")
                        : ($(this).data("startdate")
                            ? moment($(this).data("startdate"), "DD/MM/YYYY")
                            : moment().subtract(6, 'days')),
                    endDate: urlEndDate
                        ? moment(urlEndDate, "DD/MM/YYYY")
                        : ($(this).data("enddate")
                            ? moment($(this).data("enddate"), "DD/MM/YYYY")
                            : moment()),
                    maxDate: maxDateValue
                        ? moment(maxDateValue, dateFormat)
                        : ($(this).data("maxdate") ? moment($(this).data("maxdate"), "DD/MM/YYYY") : false),
                    minDate: minDateValue
                        ? moment(minDateValue, dateFormat)
                        : ($(this).data("mindate") ? moment($(this).data("mindate"), "DD/MM/YYYY") : false),
                    opens: $(this).data("opens"),
                    drops: $(this).data("drops"),
                    timePicker: timePicker,
                    timePickerSeconds: timePickerSeconds,
                    timePicker24Hour: true,
                    singleDatePicker: singleDatePicker,
                    showDropdowns: $(this).data("showdropdowns"),
                    autoApply: $(this).data("autoapply")
                };

                if($input.val() != '') {
                    if (singleDatePicker) {
                        if ($input.val().indexOf(' - ') > -1) {
                            $input.val($input.val().split(' - ')[0]);
                        }
                        options.startDate = moment($input.val(), dateFormat);
                    } else {
                        if ($input.val().indexOf(' - ') > -1) {
                            let dates = $input.val().split(' - ');
                            if (dates.length === 2) {
                                options.startDate = moment(dates[0], dateFormat);
                                options.endDate = moment(dates[1], dateFormat);
                            }
                        } else {
                            options.startDate = moment($input.val(), dateFormat);
                            options.endDate = moment($input.val(), dateFormat);
                        }
                    }
                } else {
                    if (value !== null && value !== undefined) {
                        if (singleDatePicker) {
                            if (value.indexOf(' - ') > -1) {
                                value = value.split(' - ')[0];
                            }
                            options.startDate = moment(value, dateFormat);
                        } else {
                            if (value.indexOf(' - ') > -1) {
                                let dates = value.split(' - ');
                                if (dates.length === 2) {
                                    options.startDate = moment(dates[0], dateFormat);
                                    options.endDate = moment(dates[1], dateFormat);
                                }
                            } else {
                                options.startDate = moment(value, dateFormat);
                                options.endDate = moment(value, dateFormat);
                            }
                        }
                    } else {
                        $input.attr('value', '').val('');
                    }

                    if (value !== null && value !== undefined) {
                        if (singleDatePicker) {
                            const initialDate = options.startDate.format(dateFormat);
                            $input.attr('value', initialDate).val(initialDate);
                        } else if (timePicker && timePickerSeconds) {
                            const dateWithInterval = options.startDate.format('DD/MM/YYYY HH:mm:ss')
                                + ' - ' + options.endDate.format('DD/MM/YYYY HH:mm:ss');
                            $input.attr('value', dateWithInterval).val(dateWithInterval);
                        } else if (timePicker) {
                            const dateWithInterval = options.startDate.format('DD/MM/YYYY HH:mm')
                                + ' - ' + options.endDate.format('DD/MM/YYYY HH:mm');
                            $input.attr('value', dateWithInterval).val(dateWithInterval);
                        } else {
                            const initialRange = options.startDate.format('DD/MM/YYYY')
                                + ' - ' + options.endDate.format('DD/MM/YYYY');
                            $input.attr('value', initialRange).val(initialRange);
                        }
                    }
                }

                if (showRanges) {
                    options.ranges = {
                        'Hoje': [moment(), moment()],
                        'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Essa semana': [moment().subtract(6, 'days'), moment()],
                        'Semana passada': [moment().subtract(6, 'days').startOf('week'), moment().subtract(6, 'days').endOf('week')],
                        'Últimos 15 dias': [moment().subtract(14, 'days'), moment()],
                        'Últimos 30 dias': [moment().subtract(29, 'days'), moment()],
                        'Esse mês': [moment().startOf('month'), moment().endOf('month')],
                        'Último mês': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    };
                }

                $input.daterangepicker(options, function(start, end, label) {
                    let formattedDate;
                    if (singleDatePicker) {
                        formattedDate = start.format(dateFormat);
                    } else if (timePicker && timePickerSeconds) {
                        formattedDate = start.format('DD/MM/YYYY HH:mm:ss') + ' - ' + end.format('DD/MM/YYYY HH:mm:ss');
                    } else if (timePicker) {
                        formattedDate = start.format('DD/MM/YYYY HH:mm') + ' - ' + end.format('DD/MM/YYYY HH:mm');
                    } else {
                        formattedDate = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }

                    $(this.element).val(formattedDate).attr('value', formattedDate).trigger('change');
                    this.element[0].value = formattedDate;

                    if (urlSearch) {
                        const currentUrl = new URL(window.location.href);
                        const params = currentUrl.searchParams;

                        params.set('start_date', start.format('DD/MM/YYYY'));
                        params.set('end_date', end.format('DD/MM/YYYY'));

                        currentUrl.search = params.toString();

                        window.history.pushState({}, '', currentUrl.toString());
                        window.location.reload();
                    }
                });

                $input.on('hide.daterangepicker', function(ev, picker) {
                    let formattedDate;
                    if (singleDatePicker) {
                        formattedDate = picker.startDate.format(dateFormat);
                    } else if (timePicker && timePickerSeconds) {
                        formattedDate = picker.startDate.format('DD/MM/YYYY HH:mm:ss')
                            + ' - ' + picker.endDate.format('DD/MM/YYYY HH:mm:ss');
                    } else if (timePicker) {
                        formattedDate = picker.startDate.format('DD/MM/YYYY HH:mm')
                            + ' - ' + picker.endDate.format('DD/MM/YYYY HH:mm');
                    } else {
                        formattedDate = picker.startDate.format('DD/MM/YYYY')
                            + ' - ' + picker.endDate.format('DD/MM/YYYY');
                    }
                    $(this).val(formattedDate).trigger('change');
                });
            });
        }
    };

    initializeDateRangePicker();

    window.initializeSummernote = function() {
        if ($('.summernote').length) {
            $.each($('.summernote'), function () {
                $(this).summernote({
                    placeholder: 'Descrição...',
                    tabsize: 2,
                    height: 180,
                    toolbar: [
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['insert', ['link']],
                    ],
                    callbacks: {
                        onChange: function(contents, $editable) {
                            elName = $(this).data('name') ?? 'description';
                            $(this).closest('form').find('input[name="' + elName + '"]').val(contents);
                        }
                    }
                });
            });
        }
    }

    initializeSummernote();
});

var startConfetti = function (idSuffix) {
    var text = document.getElementById("text-" + idSuffix);
    text.textContent = "Copy";
    text.className = "text hidden";

    var button = document.getElementById("button-" + idSuffix);

    const rect = button.getBoundingClientRect();
    const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
    const origin = {
        x: center.x / window.innerWidth,
        y: center.y / window.innerHeight
    };

    var myCanvas = document.createElement('canvas');
    document.body.appendChild(myCanvas);
    const defaults = {
        disableForReducedMotion: true
    };
    var colors = ['#757AE9', '#28224B', '#EBF4FF'];
    var myConfetti = confetti.create(myCanvas, {});

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(100 * particleRatio),
            origin: origin
        }));
    }

    // Trigger confetti immediately
    fire(0.25, { spread: 26, startVelocity: 10, colors });
    fire(0.2, { spread: 60, startVelocity: 20, colors });
    fire(0.35, { spread: 100, startVelocity: 15, decay: 0.91, colors });
    fire(0.1, { spread: 120, startVelocity: 10, decay: 0.92, colors });
    fire(0.1, { spread: 120, startVelocity: 20, colors });

    setTimeout(() => {
        text.textContent = "Copied!";
        text.className = "text";
    }, 0);

    setTimeout(() => {
        text.textContent = "Copy";
    }, 2000);
}


const addDotBtnsAndClickHandlers = (emblaApi, dotsNode) => {
    let dotNodes = []

    const addDotBtnsWithClickHandlers = () => {
        dotsNode.innerHTML = emblaApi
            .scrollSnapList()
            .map(() => '<button class="embla__dot" type="button"></button>')
            .join('')

        const scrollTo = (index) => {
            emblaApi.scrollTo(index)
        }

        dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'))
        dotNodes.forEach((dotNode, index) => {
            dotNode.addEventListener('click', () => scrollTo(index), false)
        })
    }

    const toggleDotBtnsActive = () => {
        const previous = emblaApi.previousScrollSnap()
        const selected = emblaApi.selectedScrollSnap()
        dotNodes[previous].classList.remove('embla__dot--selected')
        dotNodes[selected].classList.add('embla__dot--selected')
    }

    emblaApi
        .on('init', addDotBtnsWithClickHandlers)
        .on('reInit', addDotBtnsWithClickHandlers)
        .on('init', toggleDotBtnsActive)
        .on('reInit', toggleDotBtnsActive)
        .on('select', toggleDotBtnsActive)

    return () => {
        dotsNode.innerHTML = ''
    }
}

const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
    const togglePrevNextBtnsState = () => {
        if (emblaApi.canScrollPrev()) prevBtn.removeAttribute('disabled')
        else prevBtn.setAttribute('disabled', 'disabled')

        if (emblaApi.canScrollNext()) nextBtn.removeAttribute('disabled')
        else nextBtn.setAttribute('disabled', 'disabled')
    }

    emblaApi
        .on('select', togglePrevNextBtnsState)
        .on('init', togglePrevNextBtnsState)
        .on('reInit', togglePrevNextBtnsState)

    return () => {
        prevBtn.removeAttribute('disabled')
        nextBtn.removeAttribute('disabled')
    }
}

const addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
    const scrollPrev = () => {
        emblaApi.scrollPrev()
    }
    const scrollNext = () => {
        emblaApi.scrollNext()
    }
    prevBtn.addEventListener('click', scrollPrev, false)
    nextBtn.addEventListener('click', scrollNext, false)

    const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
        emblaApi,
        prevBtn,
        nextBtn
    )

    return () => {
        removeTogglePrevNextBtnsActive()
        prevBtn.removeEventListener('click', scrollPrev, false)
        nextBtn.removeEventListener('click', scrollNext, false)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    const styleSheet = style.sheet;

    const rulesAdded = new Set();

    document.querySelectorAll('*').forEach(element => {
        element.classList.forEach(className => {
            const match = className.match(/([whmp])-\[(\d+)(px|em|%|rem|vh|vw)\]/);
            if (match && !rulesAdded.has(className)) {
                const property = match[1] === 'w' ? 'width' : match[1] === 'h' ? 'height' : match[1] === 'm' ? 'margin' : 'padding';
                const value = match[2];
                const unit = match[3];
                const cssRule = `.${className.replace(/[\[\]]/g, '\\$&')} { ${property}: ${value}${unit} !important; }`;

                styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
                rulesAdded.add(className);
            }
        });
    });

    function colorizeSpecialCharsInPre() {
        const preElements = document.querySelectorAll('pre');

        preElements.forEach((pre) => {
            let html = pre.innerHTML.replace(/<\/?code>/g, '');

            html = html.replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            html = html.replace(/(&lt;|&gt;|=)/g, '<span style="color: rgba(255, 255, 255, 0.533);">$1</span>');
            html = html.replace(/(&quot;)(.*?)(&quot;)/g, '$1<span style="color: rgba(255, 255, 255, 0.533);">$2</span>$3');

            pre.innerHTML = html;
        });
    }

    colorizeSpecialCharsInPre();

    const OPTIONS = {}

    const emblaNode = document.querySelector('.embla')
    if(emblaNode){
        const viewportNode = emblaNode.querySelector('.embla__viewport')
        const prevBtnNode = emblaNode.querySelector('.embla__button--prev')
        const nextBtnNode = emblaNode.querySelector('.embla__button--next')
        const dotsNode = emblaNode.querySelector('.embla__dots')

        const emblaApi = EmblaCarousel(viewportNode, OPTIONS)

        const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
            emblaApi,
            prevBtnNode,
            nextBtnNode
        )
        const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
            emblaApi,
            dotsNode
        )

        emblaApi.on('destroy', removePrevNextBtnsClickHandlers)
        emblaApi.on('destroy', removeDotBtnsAndClickHandlers)
    }

    document.querySelectorAll('.InputOTP').forEach((otpGroup) => {
        const inputs = otpGroup.querySelectorAll('input');
        const hiddenInput = otpGroup.previousElementSibling.querySelector('input[type="hidden"]');
        const displayParagraph = otpGroup.nextElementSibling;

        const updateDisplayValue = () => {
            const otpValue = Array.from(inputs).map(input => input.value).join('');
            hiddenInput.value = otpValue;
            if (displayParagraph && displayParagraph.id === "otpValueText") {
                displayParagraph.textContent = otpValue ? 'You entered: ' + otpValue : "Enter your one-time password.";
            }
        };

        updateDisplayValue();

        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                setTimeout(updateDisplayValue, 0);

                if (e.key === "Backspace") {
                    setTimeout(() => {
                        if (input.value === '') {
                            if (index > 0) {
                                inputs[index - 1].focus();
                                inputs[index - 1].value = '';
                                hiddenInput.value = Array.from(inputs).map(input => input.value).join('');
                            }
                        } else {
                            input.value = '';
                            hiddenInput.value = Array.from(inputs).map(input => input.value).join('');
                        }
                    }, 0);
                } else if (e.key === "ArrowLeft") {
                    if (index > 0) {
                        inputs[index - 1].focus();
                    }
                } else if (e.key === "ArrowRight" || e.key === " ") {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                }
            });

            input.addEventListener('input', updateDisplayValue);

            input.addEventListener('input', () => {
                if (input.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                hiddenInput.value = Array.from(inputs).map(input => input.value).join('');
                // console.log(hiddenInput.value)
                subtitle = hiddenInput.value
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text').slice(0, inputs.length - index);
                pasteData.split('').forEach((char, i) => {
                    inputs[index + i].value = char;
                    if (index + i < inputs.length - 1) {
                        inputs[index + i + 1].focus();
                    }
                });
                hiddenInput.value = Array.from(inputs).map(input => input.value).join('');
                updateDisplayValue();
            });
        });
    });


});

function logger(message) {
    // console.log(message);
}

function togglePasswordView(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    button.textContent = button.textContent === 'Mostrar' ? 'Esconder' : 'Mostrar';
    input.type = input.type === 'password' ? 'text' : 'password';
}

function getParams(title, description) {
    const sonners = document.querySelector(".sonner");
    const el = document.createElement("div");
    el.className = "d-flex flex-column pe-5";

    const titleSpan = document.createElement("span");
    titleSpan.className = "text-xs font-medium";
    titleSpan.innerText = title;
    el.appendChild(titleSpan);

    const descriptionSpan = document.createElement("span");
    descriptionSpan.className = "text-xs text-muted";
    descriptionSpan.innerText = description;
    el.appendChild(descriptionSpan);

    sonners.appendChild(el);
    reset();

    setTimeout(() => {
        el.classList.add("out");
        setTimeout(() => {
            if (sonners.contains(el)) {
                sonners.removeChild(el);
                reset();
            }
        }, 300);
    }, 5000);

    function reset() {
        Array.from(sonners.children).reverse().forEach((s, i) => {
            s.style.setProperty("--index", -i);
            s.onclick = () => {
                s.classList.add("out");
                setTimeout(() => {
                    if (sonners.contains(s)) {
                        sonners.removeChild(s);
                        reset();
                    }
                }, 300);
            }
        });
    }

    reset();
}

function formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDate(dateString) {
    var date = new Date(dateString);
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    var year = date.getFullYear();

    return day + '/' + month + '/' + year;
}

function formatDateTime(dateTimeString) {
    var date = new Date(dateTimeString);
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    var year = date.getFullYear();
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');

    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

function aplicaMaskMoney() {
    if ($('input[data-mask-money]').length) {
        $.each($("input[data-mask-money]"), function (i, o) {
            var prefix = '';
            var suffix = '';
            var precision = 2;

            if ($(this).attr("data-mask-money-prefix") != '') {
                prefix = $(this).attr("data-mask-money-prefix");
            }

            if ($(this).attr("data-mask-money-suffix") != '') {
                suffix = $(this).attr("data-mask-money-suffix");
            }

            if ($(this).attr("data-mask-money-precision") != '') {
                precision = parseInt($(this).attr("data-mask-money-precision"));
            }

            $(this).maskMoney({ prefix: prefix, suffix: suffix, decimal: ",", thousands: ".", allowNegative: false, precision: precision });
        });
    }
}

function aplicaMask() {
    if ($('input[data-mask]').length) {
        $.each($("input[data-mask]"), function (i, o) {
            var $o = $(o),
                reverse = (($o.attr("data-mask-reverse") == "true") ? true : false);
            $o.mask($o.attr("data-mask"), {
                reverse: reverse
            });
            delete $o;
        });
    }
}

$(document).ready(function () {
    if ($(window).width() <= 743) {
        $('.ghost-dropdown').removeClass('ghost-dropdown');
    }
    $(window).resize(function () {
        if ($(window).width() <= 743) {
            $('.ghost-dropdown').removeClass('ghost-dropdown');
        }
    });
});

document.querySelectorAll('.switch input[type="checkbox"]').forEach(function (checkbox) {
    var hiddenInput = checkbox.previousElementSibling;

    if (checkbox.checked) {
        hiddenInput.removeAttribute('name');
    }

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            hiddenInput.removeAttribute('name');
        } else {
            hiddenInput.setAttribute('name', checkbox.getAttribute('name'));
        }
    });
});

function initializeSpectrum() {
    $('.color-picker').each(function() {
        if ($(this).data('spectrum')) {
            $(this).spectrum('destroy'); // Destroy existing instance
        }
        $(this).spectrum({
            chooseText: "Escolher",
            cancelText: "Cancelar",
            clearText: "Limpar",
            noColorSelectedText: "teste",
            type: "component",
            showInput: true,
            preferredFormat: "hex",
            change: function(color) {
                const colorPicker = $('#color-picker');
                if (colorPicker.length) {
                    colorPicker.val(color.toHexString());
                }
            },
            move: function(color) {
                const colorPicker = $('#color-picker');
                if (colorPicker.length) {
                    colorPicker.val(color.toHexString());
                }
            }
        });
    });
}

$(document).ready(function(){
    $.fn.validator.Constructor.VALIDATORS.minmoney = function(el) {
        let rawValue = el.val().replace(/[^0-9]/g, "");
        let numericValue = parseFloat(rawValue) || 0;

        let min = parseFloat(el.data('minmoney'));
        if (numericValue < min) {
            if(!el.data('minmoney-error')) {
                return 'O preço mínimo é de R$ ' + min.toFixed(2);
            }
            return el.data('minmoney-error');
        }
    };

    $.fn.validator.Constructor.VALIDATORS.maxmoney = function(el) {
        let rawValue = el.val().replace(/[^0-9]/g, "");
        let numericValue = parseFloat(rawValue) || 0;

        let max = parseFloat(el.data('maxmoney'));
        if (numericValue > max) {
            if(!el.data('maxmoney-error')) {
                return 'O preço máximo é de R$ ' + max.toFixed(2);
            }
            return el.data('maxmoney-error');
        }
    }

    $('form[data-toggle="validator"]').each(function(){
        $(this).removeData('bs.validator');
        $(this).validator();
    });

    $('form[data-toggle="validator"]').on('submit', function(e) {
        $(this).validator('validate');

        if($(this).find('.has-error').length > 0) {
            e.preventDefault();
            $(this).data('bs.validator').focusError();
            return false;
        }
    });
});

// Script para controle das tabs com ou sem aninhamento.
$(document).ready(function() {
    // Cria e armazena o grupo de abas.
    const tabGroups = {};
    $('.container-tabs[data-tabs-id]').each(function() {
        const $container = $(this);
        const tabGroupId = $container.attr('data-tabs-id');
        const $tabGroup = $container.find('.nav-pills');
        if (!$tabGroup.length || $container.attr('data-keep-state') !== 'true') return;

        // Salva informações do grupo de abas.
        tabGroups[tabGroupId] = {
            $element: $tabGroup,
            queryParam: tabGroupId.toLowerCase(),
            $tabs: $tabGroup.find('button[data-bs-toggle="pill"]'),
            hasNested: $container.find('.container-tabs[data-tabs-id]').length > 0,
            nestedParam: null,
            parentTab: null,
            triggerValue: null,
            currentTab: null,
            lastNestedTab: null
        };

        // Identificar abas aninhadas.
        const $nestedContainer = $container.find('.container-tabs[data-tabs-id]');
        if ($nestedContainer.length) {
            tabGroups[tabGroupId].nestedParam = $nestedContainer.attr('data-tabs-id').toLowerCase();
        }

        // Identificar abas pai.
        const $parentPane = $container.closest('.tab-pane');
        if ($parentPane.length) {
            const $parentTabGroup = $container.closest('.container-tabs[data-tabs-id]');
            if ($parentTabGroup.length) {
                const parentGroupId = $parentTabGroup.attr('data-tabs-id');
                tabGroups[tabGroupId].parentTab = parentGroupId.toLowerCase();
                tabGroups[tabGroupId].triggerValue = $parentPane.attr('id');
            }
        }
    });

    // Obtém o estado atual das abas.
    function getCurrentState() {
        const state = {};
        $.each(tabGroups, function(tabGroupId, group) {
            const $activeTab = group.$element.find('.nav-link.active');
            if ($activeTab.length) {
                const tabValue = $activeTab.attr('data-bs-target').substring(1);
                group.currentTab = tabValue;
                state[group.queryParam] = tabValue;
            }
        });
        return state;
    }

    // Atualiza a URL com o estado das abas, preservando os demais parâmetros,
    // e garantindo que os parâmetros dos tabs fiquem primeiro.
    function updateUrlWithState() {
        const state = getCurrentState(); // tab-related parameters
        const url = new URL(window.location.href);
        const newParams = new URLSearchParams();
        // Adiciona os parâmetros dos tabs primeiro.
        $.each(state, function(key, value) {
            newParams.set(key, value);
        });
        // Em seguida, anexa os demais parâmetros que já estavam na URL.
        url.searchParams.forEach(function(value, key) {
            if (!state.hasOwnProperty(key)) {
                newParams.append(key, value);
            }
        });
        url.search = newParams.toString();
        window.history.pushState({}, document.title, url);
    }

    // Se houver um formulário na página (ou especifique o seletor adequado),
    // adicione inputs hidden para cada grupo de abas, se ainda não existirem.
    const $form = $('form');
    $.each(tabGroups, function(tabGroupId, group) {
        if ($form.find(`input[name="${group.queryParam}"]`).length === 0) {
            $form.append(`<input type="hidden" name="${group.queryParam}" value="">`);
        }
    });

    // Atualiza os inputs hidden do formulário com os valores atuais dos tabs.
    function updateFormHiddenTabs() {
        $.each(tabGroups, function(tabGroupId, group) {
            $form.find(`input[name="${group.queryParam}"]`).val(group.currentTab || '');
        });
    }

    // Ao clicar numa aba, atualiza o estado, os inputs hidden e a URL.
    $.each(tabGroups, function(tabGroupId, group) {
        group.$tabs.on('shown.bs.tab', function(e) {
            const tabValue = $(e.target).attr('data-bs-target').substring(1);
            group.currentTab = tabValue;
            if (group.parentTab && tabGroups[group.parentTab]) {
                tabGroups[group.parentTab].lastNestedTab = tabValue;
            }
            updateFormHiddenTabs();
            updateUrlWithState();
        });
    });

    // Restaura o estado das abas a partir da URL.
    const urlParams = new URLSearchParams(window.location.search);
    $.each(tabGroups, function(tabGroupId, group) {
        const activeTab = urlParams.get(group.queryParam);
        if (activeTab) {
            group.currentTab = activeTab;
            const $tabElement = group.$element.find(`button[data-bs-target="#${activeTab}"]`);
            if ($tabElement.length) {
                new bootstrap.Tab($tabElement[0]).show();
            }
        }
    });
    updateFormHiddenTabs();
});
