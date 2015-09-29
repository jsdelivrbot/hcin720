var AUTO_LIGHTING = function() {
    var activeDatasource = 'serial';
    var sparkBaseURL = 'https://api.spark.io/v1/devices/';
    var sparkDeviceID = '3b003b001747343337363432';
    var sparkAccessToken = '6163d05c2f208fcd29c06141e7fe66e800a33626';
    var socket;

    (function bindEventHandlers() {
        $('.cube-switch .switch').click(function() {
            if ($('.cube-switch').hasClass('active')) {
                $('.cube-switch').removeClass('active');
                $('#light-bulb2').css({'opacity': '0'});
            } else {
                $('.cube-switch').addClass('active');
                $('#light-bulb2').css({'opacity': '1'});
            }
        });

        $('input[name=light-switch]').click(function(){
            socket.emit('to serial', $(this).attr('data-index'));
        });

        $('input[name=data-switch]').click(function(){
            activeDatasource = $(this).attr('data-source');
        });

        $('input[name=light-switch]').click(function(){
            var url = sparkBaseURL + sparkDeviceID + '/' + 'setLightMode';
            $.ajax({
                type: 'POST',
                url: url,
                data: { access_token: sparkAccessToken, args: $(this).attr('data-index') },
                success: function() {
                    $('#result').text('Success');
                },
                dataType: 'json'
            });
        });

    })();


    function updateUI(deviceData, source) {
        if(source != activeDatasource) {
            return;
        }

        function adjustLighting(lightLevel) {
            $('#sun-light').css({'opacity': lightLevel});
        }

        function putLightBulb(state) {
            if (state === 'on') {
                $('#light-bulb2').css({'opacity': 1});
            } else {
                $('#light-bulb2').css({'opacity': 0});
            }
        }

        function toggleSwitches(lightMode) {
            $('#radio-' + lightMode).prop('checked', true);
        }

        function updateProximity(proximity) {
            $('#proximity').val(proximity);
        }

        adjustLighting(deviceData.light);
        putLightBulb(deviceData.ledStatus);
        toggleSwitches(deviceData.lightMode);
        updateProximity(deviceData.proximity);
    }

    function initSerialSocket() {
        socket = io();
        socket.on('to browser', function(data)
        {
            var deviceData = JSON.parse(data);
            updateUI(deviceData, 'serial');
        });

    }

    //this code follows recommendations in
    //https://community.particle.io/t/tutorial-getting-started-with-spark-publish/3422
    function initCloudEventSource() {

        var eventSource = new EventSource(sparkBaseURL + sparkDeviceID + '/events/?access_token=' + sparkAccessToken);

        eventSource.addEventListener('error', function(e) {
            console.log('Failed to connect to Spark API.'); },false);

        eventSource.addEventListener('deviceStatus', function(e) {
            var parsedData = JSON.parse(e.data);
            var deviceData = JSON.parse(parsedData.data);
            updateUI(deviceData, 'cloud');
        }, false);

    }


    return {
        init: function() {
            initSerialSocket();
            initCloudEventSource();
        },
        getActiveDatasource: function() {
            return activeDatasource;
        }

    }
}();

AUTO_LIGHTING.init();
