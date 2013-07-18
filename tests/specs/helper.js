describe('handlebars helper', function () {
    var assert = chai.assert;
    var resStore = {
        dev: { translation: { 'simple': 'ok_from_dev' } },
        en: { translation: { 'simple': 'ok_from_en' } },
        'en-US': { translation: {
            'simple': 'ok_from_en-US',
            'context': 'I am a cool __type__ and my name is __name__.',
            'sprintf': 'Hey %s, welcome %s',
            'mix': '%s are __qualify__ and will __temporality__ be.'
        } }
    };

    beforeEach(function () {
        this.app = new Fossil.Application({
            services: {
                i18n: new Fossil.Services.I18next({
                    init: {
                        resStore: resStore,
                        lng: 'en-US'
                    }
                })
            }
        });
    });

    it('should declare Handlebars template', function() {
        var tmpl = Handlebars.compile('{{t "simple"}}');
        assert.equal(tmpl(), 'ok_from_en-US');
    });

    it('should be possible to use context', function() {
        var tmpl = Handlebars.compile('{{t "context"}}');
        assert.equal(tmpl({
            "type": "framework",
            "name": "Fossil"
        }), "I am a cool framework and my name is Fossil.");
    });

    it('should be possible to pass arguments sprintf style', function() {
        var tmpl = Handlebars.compile('{{t "sprintf" "Jude" "to the jungle"}}');
        assert.equal(tmpl(), 'Hey Jude, welcome to the jungle');
    });

    it('should be possible to pass arguments as hash', function() {
        var tmpl = Handlebars.compile('{{t "context" name="Fossil" type="framework"}}');
        assert.equal(tmpl(), 'I am a cool framework and my name is Fossil.');
    });

    it('should be possible to mix context and arguments', function() {
        var tmpl = Handlebars.compile('{{t "mix" "Bow ties" temporality="ever"}}');
        assert.equal(tmpl({
            "qualify": "cool"
        }), "Bow ties are cool and will ever be.");
    });
});
