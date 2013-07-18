(function (_, Fossil, Handlebars, i18next, jQuery) {
var I18next = Fossil.Services.I18next = Fossil.Service.extend({

    initialize: function () {
        // add helper
        Handlebars.registerHelper('t', function (key) {
            var sprintf = _.tail(arguments);
            var ctx = sprintf.pop().hash;
            if (sprintf.length) {
                ctx = _.extend({
                    postProcess: 'sprintf',
                    sprintf: sprintf
                }, ctx);
            }
            if (window && this !== window && !_.isElement(this)) {
                ctx = _.extend(ctx, this);
            }
            var result = i18next.t(key, ctx);
            return new Handlebars.SafeString(result);
        });
        // expose t function.
        this.t = _.bind(i18next.t, i18next);
    },

    _doActivateApplication: function (application) {
        // initialize i18next
        var d = new $.Deferred();
        application.waitFor(d);
        var options = {
            fallbackLng: false,
            nsseparator: '::'
        };
        if (this.options.init) {_.extend(options, this.options.init);}
        if (application.i18nextNs) {options.ns = application.i18nextNs;}
        i18next.init(options, function (t) {
            d.resolve(t);
        });

        // register ns change on module switch
        application.on('module:change', function (oldModule, newModule) {
            if (newModule.i18nextNs) {
                i18next.setDefaultNamespace(newModule.i18nextNs);
            }
        });
    },

    _doActivateModule: function (module, application) {
        if (module.i18nextNs) {
            var d = new $.Deferred();
            i18next.loadNamespace(module.i18nextNs, function () {
                d.resolve();
            });
            application.waitFor(d);
        }
    }
});
return Fossil.Services.I18next;
})(_, Fossil, Handlebars, i18n, jQuery);