(function (define) {

    define(['./_base', 'when', 'file-api/form-data'], function (base, when, FormData) {
        "use strict";

        /**
         * MIME type support for request and response entities.  Entities are
         * (de)serialized using the converter for the MIME type.
         *
         * Request entities are converted using the desired converter and the 'Accept' request header prefers this MIME.
         *
         * Response entities are converted based on the Content-Type response header.
         *
         * @param {Client} [client] client to wrap
         * @param {String} [config.mime='text/plain'] MIME type to encode the request entity
         * @param {String} [config.accept] Accept header for the request
         *
         * @returns {Client}
         */
        return base({
            request: function (request, config) {
                var stream, d, formData;
                if (request.entity && (request.entity instanceof FormData)) {
                    formData = request.entity;
                    stream = formData.serialize();
                    request.headers['Content-Type'] = formData.getContentType();
                    d = when.defer();
                    stream.on('size', function (size) {
                        request.headers['Content-Length'] = size;
                    });
                    stream.on('load', function (data) {
                        request.entity = data;
                        d.resolve(request);
                    });
                    return d.promise;
                } else {
                    return request;
                }
            }
        });

    });

}(
    typeof define === 'function' ? define : function (deps, factory) {
        module.exports = factory.apply(this, deps.map(require));
    }
    // Boilerplate for AMD and Node
));
