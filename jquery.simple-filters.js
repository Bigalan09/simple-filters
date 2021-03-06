(function($) {

    $.fn.simpleFilters = function(options) {
        return this.each(function() {
            var $table = $(this);
            $options = options || {};
            $options = $.extend({}, $.fn.simpleFilters.options, options);
            $filters = new Array("---", "---");
            $rows = $table.find("tbody tr");
            if ($options.footer.toString().toLowerCase() === "off")
                $table.find('tfoot').hide();
            if ($options.external) {
                $.each(options.external, function(index, val) {

                    var $filter = new Array();

                    $rows.each(function() {
                        var $key = $(this).find('td:eq(' + val.column + ')').text();
                        if (!($key in $filter)) $filter[$key] = $key;
                    });
                    $select = $('<select />');
                    $select.attr('id', 'filter-' + val.column);

                    for (var i in $filter) {
                        $select.append("<option>" + i + "</option>");
                    }

                    $opt = $select.find('option');
                    switch (val.type) {
                        case "date":
                            $opt.sort(function(a, b) {
                                return new Date(a.text) - new Date(b.text);
                            });
                            break;
                        case "numeric":
                        case "number":
                            $opt.sort(function(a, b) {
                                if (Number(a.text) > Number(b.text)) return 1;
                                else if (Number(a.text) < Number(b.text)) return -1;
                                else return 0;
                            });
                            break;
                        case "string":
                        case "text":
                            $opt.sort(function(a, b) {
                                if (a.text > b.text) return 1;
                                else if (a.text < b.text) return -1;
                                else return 0;
                            });
                            break;
                    }
                    $select = $select.empty().append($opt);
                    $select.prepend("<option>---</option>");
                    $select.find('option:first-child').attr("selected", "selected");

                    $select.on('change', function() {
                        $table.trigger("beforetablefilter", {});
                        $selected = $(this).find(':selected').text();
                        $col = $(this).attr('id').replace("filter-", "");
                        $filters[$col] = $selected;
                        $search = new Array();
                        setTimeout(function() {
                            $.each($filters, function(key, val) {
                                if (val !== "---") $search[key] = val;
                            });
                            $rows.show().find(".arrow").remove();
                            setTimeout(function() {
                                $.each($rows, function($rowKey, $rowVal) {
                                    $row = $(this);
                                    $.each($search, function($col, $val) {
                                        if ($val !== undefined) {
                                            $column = $row.find('td:eq(' + $col + ')').text();
                                            if ($column.match('^' + $val + '$') === null) $row.hide();
                                        }
                                    });
                                });
                                $filteredRows = $table.find("tbody tr:visible");
                                if ($options.filterSelects) $.fn.simpleFilters.updateSelect($options, $filteredRows, $col);
                                $filteredCount = $filteredRows.length;
                                $(".no-result").remove();
                                if ($filteredCount == 0) {
                                    $colLength = $table.find("thead th").length;
                                    $noResult = $("<tr />").addClass("no-result").css({
                                        "text-align": "center",
                                        "font-weight": "bold",
                                        "color": "red"
                                    }).append($("<td />").attr("colspan", $colLength).html("No Results found."));
                                    $table.find('tbody').append($noResult);
                                }
                                $table.trigger("aftertablefilter", {});
                            }, 1);
                        }, 1);
                    });
                    $(val.placeholder).append($select);
                });
            }
        });
    };
    $.fn.simpleFilters.updateSelect = function(options, rows, col) {
        if (options.external) {
            $.each(options.external, function(key, val) {
                $previousSelect = $('#filter-' + key).find(':selected').val();
                $select = $('#filter-' + key);
                var $filter = new Array();

                rows.each(function() {
                    var $key = $(this).find('td:eq(' + val.column + ')').text();
                    if (!($key in $filter))
                        $filter[$key] = $key;
                });
                $select.empty();
                for (var i in $filter) {
                    $select.append("<option>" + i + "</option>");
                }

                $opt = $select.find('option');
                switch (val.type) {
                    case "date":
                        $opt.sort(function(a, b) {
                            return moment(b.text).toDate() - moment(a.text).toDate();
                        });
                        break;
                    case "numeric":
                        $opt.sort(function(a, b) {
                            if (Number(a.text) > Number(b.text)) return 1;
                            else if (Number(a.text) < Number(b.text)) return -1;
                            else return 0;
                        });
                        break;
                    case "string":
                        $opt.sort(function(a, b) {
                            if (a.text > b.text) return 1;
                            else if (a.text < b.text) return -1;
                            else return 0;
                        });
                        break;
                }

                $select = $select.empty().append($opt);
                $select.prepend("<option>---</option>");
                if ($previousSelect === "---")
                    $select.find('option:first-child').attr("selected", "selected");
                else
                    $select.val($previousSelect);
            });
        }
    }
    $.fn.simpleFilters.options = {
        "filterSelects": false,
        "footer": "on"
    };
})(jQuery);
