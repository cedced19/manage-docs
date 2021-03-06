'use strict';
$(document).ready(function () {

    var path = require('path'),
          fs = require('fs'),
          md5 = require('./node_modules/MD5');

    $('#exec').click(function (e) {
        e.preventDefault();
        if ($('form')[0].checkValidity()) {
            var input = path.normalize($('#path').val());
            if (fs.existsSync(input)) {
                    var key = md5(md5($('#email').val()) + md5($('#password').val())),
                          mode = $('input:radio[name=radio]:checked').val(),
                          cipher = $('#cipher').val()[0];
                    encryptor(input, key, mode, cipher, function (err) {
                        if (err) {
                            $.snackbar({content: 'An error occurred!'});
                        } else {
                            $.snackbar({content: 'Done!'});
                        }
                    });
            } else {
                $.snackbar({content: 'Please set an existing path!'});
            }
        } else {
            $.snackbar({content: 'Please complete all fields!'});
        }
    });

});
