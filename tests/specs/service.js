describe('i18n Service', function () {
    var assert = chai.assert;

    it('should expose a `t` method', function() {
        var i18n = new Fossil.Services.I18next({
            engine: 'handlebars'
        });

        assert.isFunction(i18n.t);
    });

    it('should pass options to i18next', function() {
        var resStore = {
            dev: { translation: { 'simple': 'ok_from_dev' } },
            en: { translation: { 'simple': 'ok_from_en' } },
            'en-US': { translation: { 'simple': 'ok_from_en-US' } }
        };
        var app = createI18nApplication({
            init: {
                resStore: resStore,
                lng: 'en-US'
            },
            engine: 'handlebars'
        });

        assert.equal(app.services.i18n.t('simple'), 'ok_from_en-US');
    });

    it('should throw an exception if engine options is missing', function() {
        assert.throws(function () {
            var i18n = new Fossil.Services.I18next({
                engine: null
            });
        });
    });

    it('should throw an exception if engine is not "handlebars"', function() {
        assert.throws(function () {
            createI18nApplication({
                engine: 'XXX'
            });
        });
    });

    function createI18nApplication(options) {
        return new Fossil.Application({
            services: {
                i18n: new Fossil.Services.I18next(options)
            }
        });
    }
});
