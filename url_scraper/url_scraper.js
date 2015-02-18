(function ($) {
    
Drupal.behaviors.projects_mod = {
    attach: function(context, settings) {


        $('input.aliasList').each(function() {
            $(this).autocomplete({
              	source: function( request, response ) {
                    $.ajax({
                        url : '/ajax/alias_autocomplete',
                        dataType: "json",
                        data: {
                          term: request.term,
                        },
                        success: function( data ) {
                            response( $.map( data, function( item ) {
                                var code = item.split("|");
                                return {
                                    label: code[1],
                                    value: code[0],
                                    data: item
                                }
                            }));
                        }
                    });
                },
                autoFocus: true,
                minLength: 0      	
            });
        });

     
function autocomplete() {
            $(this).autocomplete({
              	source: function( request, response ) {
                    $.ajax({
                        url : '/ajax/alias_autocomplete',
                        dataType: "json",
                        data: {
                          term: request.term,
                        },
                        success: function( data ) {
                            response( $.map( data, function( item ) {
                                var code = item.split("|");
                                return {
                                    label: code[1],
                                    value: code[0],
                                    data: item
                                }
                            }));
                        }
                    });
                },
                autoFocus: true,
                minLength: 0      	
            });
}

        // Start the Link Crawler
        $('button.start_crawl', context).on('click', function() {
            var url = $('#edit-url--2').val();
            var email = $('#edit-email').val();
            var theurl = '/ajax/start_crawler?url=' + url + '&email=' + email + '&process=start';
            
            $.ajax({
                url: theurl,
                success: function(data) {
                alert(data);
                },
            });
            return false;
        });
        
        // Delete Crawled contents and Crawl again
        $('button.crawl_again', context).on('click', function() {
            var url = $('#edit-url--2').val();
            var email = $('#edit-email').val();
            var theurl = '/ajax/start_crawler?url=' + url + '&email=' + email + '&process=crawl_again';
            
            $.ajax({
                url: theurl,
                success: function(data) {
                //    $('#urlcontainer').html(data);
                alert(data);
                },
                timeout: 2000 
            });
            return false;
        });

        // Get Links Results
          $('#block-system-main', context).on('click', 'button.get_links', function() {
            var url = $('#edit-url--2').val();
            var email = $('#edit-email').val();
            var theurl = '/ajax/start_crawler?url=' + url + '&email=' + email + '&process=get_links';
            
            $.ajax({
                url: theurl,
                success: function(data) {
                    $('#urlcontainer').html(data);
                    $("#urlcontainer input.aliasList").each(autocomplete);
                },
            });
            return false;
        });
        
        // Save Links Results to Local Database
        $('button.save_links', context).on('click', function() {
            var that = $('form#url-scraper-url-form'),
            methods = that.attr('method'),
            data = that.serialize();
            
            $.ajax({
                url: '/ajax/save_results?process=save',
                type: methods,
                data: data,
                success: function(data) {
                    window.location.reload();
                }
            });
            return false;
        });
        
        // Update Links Results on Local Database
        $('button.update_links', context).on('click', function() {
            var that = $('form#url-scraper-url-form'),
            methods = that.attr('method'),
            data = that.serialize();
            
            $.ajax({
                url: '/ajax/update_results?process=update',
                type: methods,
                data: data,
                success: function(data) {
                    $('#urlcontainer').html(data);
                    $("#urlcontainer input.aliasList").each(autocomplete);
                    alert('Your results have been saved. If you are happy with them you can click "Create Redirects" at the bottom of the page to complete the process. If not you are safe to finish or come back at a later time.');
                }
            });
            return false;
        });
        // Sort Results
        $('#url-scraper-url-form', context).on('click', '.header-cat', function() {
            sort = $(this).data('sort');
            console.log("hi");
            by = $(this).data('by');
            domain = $('input[name=domain]').val();
            
                        
            $.ajax({
                url: '/ajax/sort?sort=' + sort + '&by=' + by + '&domain=' + domain,
                success: function(data) {
                    $('#urlcontainer').html(data);
                    $("#urlcontainer input.aliasList").each(autocomplete);
                }
            });
            return false;
        });

        // Start Over, Remove saved items so that we can fetch results from the cached server again.
        $('button.start_over', context).on('click', function() {
            var that = $('form#url-scraper-url-form'),
            methods = that.attr('method'),
            data = that.serialize();
            
            $.ajax({
                url: '/ajax/start_over?process=start_over',
                type: methods,
                data: data,
                success: function(data) {
                    window.location.reload();
                }
            });
            return false;
        });
    }
}
})(jQuery);