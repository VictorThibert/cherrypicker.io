console.log("OK")

$('body').tooltip({
    items: '.neutral',
    content: 'Loading…',
    show: null, // show immediately
    open: function(event, ui)
    {
        console.log("OK")
        if (typeof(event.originalEvent) === 'undefined')
        {
            return false;
        }
        
        var $id = $(ui.tooltip).attr('id');
        
        // close any lingering tooltips
        $('div.ui-tooltip').not('#' + $id).remove();
        
        // ajax function to pull in data and add it to the tooltip goes here
    },
    close: function(event, ui)
    {
        ui.tooltip.hover(function()
        {
            $(this).stop(true).fadeTo(400, 1); 
        },
        function()
        {
            $(this).fadeOut('400', function()
            {
                $(this).remove();
            });
        });
    }
});