(function (_, Fossil, Handlebars, i18next, jQuery) {
var messages = {
  'engine_required': 'engine options is required.',
  'handlebars_only': 'Only handlebars is supported for now.'
};

var I18next = Fossil.Services.I18next = Fossil.Service.extend({
    initialize: function (options) {
        this.i18next = i18next;

        // expose t function.
        this.t = _.bind(i18next.t, i18next);

        this.engine = validateEngine(options.engine);
        Handlebars.registerHelper('t', createHelper());
    },

    _doActivateApplication: function (application) {
        initI18next(application, this.options, this.engine);
        loadTranslations(application);
        registerHelpers(application, this.i18next.options.nsseparator, this.engine);
    },

    _doActivateModule: function (module, application) {
        loadTranslations(module);
        registerHelpers(module, this.i18next.options.nsseparator, this.engine);
    },

    _doActivateFragment: function (fragment, parent) {
        loadTranslations(fragment);
        registerHelpers(fragment, this.i18next.options.nsseparator, this.engine);
    }
});

function validateEngine(engine) {
    if (!engine) {throw new Error(messages.engine_required);}
    if (typeof engine !== "string") {
        engine = engine.engine;
    }

    if (engine !== 'handlebars') {
        throw new Error(messages.handlebars_only);
    }

    return engine;
}

function initI18next(application, config, engine) {
    // initialize i18next and defer execution
    var d = new $.Deferred();
    application.waitFor(d);
    i18next.init(config.init || {}, function (t) {
        d.resolve(t);
    });
}
function loadTranslations(component) {
    if (component.i18nextNs) {
        var d = new $.Deferred();
        i18next.loadNamespace(component.i18nextNs, function () {
            d.resolve();
        });
        component.waitFor(d);
    }
}
function registerHelpers(component, separator, engine) {
    // add helper
    component.helpers = _.extend(component.helpers || {}, {
        't': createHelper(component.i18nextNs)
    });
}

function createHelper(ns) {
    return function t(key) {
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
        if (ns) {
            ctx.ns = ns;
        }
        var result = i18next.t(key, ctx);
        return new Handlebars.SafeString(result);
    };
}
return Fossil.Services.I18next;
})(_, Fossil, Handlebars, i18n, jQuery);