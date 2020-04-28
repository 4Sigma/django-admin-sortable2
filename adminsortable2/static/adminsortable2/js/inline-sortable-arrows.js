setTimeout(function() {
    django.jQuery(function($) {
            function unloadEditors() {
                $('textarea.editor:hidden').each(function(){
                    var tagId = $(this).attr('id');
                    CKEDITOR.instances[ tagId ].destroy();
                });
            }

            function loadEditors() {
                $('textarea.editor:visible').each(function(){
                    var tagId = $(this).attr('id');
                    CKEDITOR.replace( tagId );
                });
            }

            var arr_elem = new Array();
            $('div.inline-group.sortable').each(function () {
                    var this_id = $(this).attr('id');
                    arr_elem[this_id] = new Array();

                    var $order_div = $(this).nextUntil('div.default_order_field').next()
                    var default_order_field = $order_div.attr('default_order_field');
                    var default_order_direction = $order_div.attr('default_order_direction');
                    var order_input_field = 'input[name$="-' + default_order_field + '"]';
                    arr_elem[this_id] = {
                        $order_div: $order_div,
                        default_order_field: default_order_field,
                        default_order_direction: default_order_direction,
                        order_input_field: order_input_field
                    }
                    // first, try with tabluar inlines
                    var tabular_inlines = $(this).find('div.tabular table');
                    var that = this;
                    tabular_inlines.sortable({
                            draggable: false,
                            disabled: false,
                            iframeFix: true,
                            handle: $(this).find('tbody .drag'),
                            items: 'tr.form-row.has_original',
                            axis: 'y',
                            scroll: true,
                            cursor: 'ns-resize',
                            containment: $(this).find('tbody'),
                            stop: function (event, dragged_rows) {
                                    var $result_list = $(this);
                                    $result_list.find('tbody tr').each(function (index) {
                                            $(this).removeClass('row1 row2').addClass(index % 2 ? 'row2' : 'row1');
                                    });
                                    var originals = $result_list.find('tbody tr.has_original').get()
                                    if (default_order_direction === '-1') {
                                            originals.reverse();
                                    }
                                    $(originals).each(function (index) {
                                            $(this).find(order_input_field).val(index + 1);
                                    });
                            }
                    });
                    if (tabular_inlines.length)
                            return true;
                    $(this).sortable({
                            draggable: false,
                            disabled: false,
                            iframeFix: true,
                            handle: 'h3',
                            items: 'div.inline-related.has_original',
                            axis: 'y',
                            scroll: true,
                            cursor: 'ns-resize',
                            containment: $(this),
                            stop: function (event, dragged_rows) {
                                    var $result_list = $(this);
                                    var originals = $result_list.find('div.inline-related.has_original').get()
                                    if (default_order_direction === '-1') {
                                        originals.reverse();
                                    }
                                    $(originals).each(function (index) {
                                        $(this).find(order_input_field).val(index + 1);
                                    });
                            }
                    });
                    $('#'+this_id+' div[data-z]').click(function(e){
                        unloadEditors();
                        var jTarget = $(e.target),
                            dir = jTarget.data('dir'),
                            jItem = $(e.currentTarget),
                            jItems = $('div.inline-related.has_original'),
                            index = jItems.index(jItem);

                        switch (dir) {
                            case 'up':
                                if (index != 0) {
                                    var item = $(this).detach().insertBefore(jItems[index - 1]);
                                }
                            break;
                            case 'down':
                                if (index != jItems.length - 1) {
                                    var item = $(this).detach().insertAfter(jItems[index + 1]);
                                }
                            break;
                        }
                        var $result_list = $('#'+this_id);
                        var originals = $result_list.find('div.inline-related.has_original').get()
                        if (arr_elem[this_id].default_order_direction === '-1') {
                            originals.reverse();
                        }
                        $(originals).each(function (index) {
                                $(this).find(arr_elem[this_id].order_input_field).val(index + 1);
                        });
                        loadEditors();
                });
            });
    });
}, 1000);
