Fossil-i18next
==============

Fossil-i18next is a [Fossil](https://github.com/themouette/fossil-core) +
[Handlebars](http://handlebarsjs.com/) [i18next](http://i18next.com)
integration.

[![Build
Status](https://travis-ci.org/themouette/fossil-i18next.png?branch=master)](https://travis-ci.org/themouette/fossil-i18next)

Install
-------

If you use bower:

`bower install fossil-i18next --save`

Git install:

```
$ git clone https://github.com/themouette/fossil-i18next.git && npm install
```

Usage
-----

In your application, just declare the `I18next` service, and the i18next context
for application template.

``` javascript
var MyApp = Fossil.Application.extend({
    services: {
        i18n: new Fossil.Services.I18next({
            init: {} // the i18next init options
        })
    },
    i18nextNs: 'myapplication'
});
```

You can specify different i18next namespaces for each module:

``` javascript
var MyModule = Fossil.Module.extend({
    i18nextNs: 'mymodule'
});
```

In templates, use the t helper as follow:

```html
<h1>{{t "my text with %s" "placeholder"}}</h1>
<p>
    {{t "welcome __user.name__"}}
</p>
```

License
-------

Fossil-i18n is an open source project licensed under the MIT license. See
`LICENSE` file for more informations.

