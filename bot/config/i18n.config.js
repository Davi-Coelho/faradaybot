const { I18n } = require('i18n');
const path = require('path');

console.log(__dirname)

const i18n = new I18n({
    locales: ['pt-BR', 'en-US'],
    defaultLocale: 'pt-BR',
    directory: path.join(__dirname, '/locales')
});

module.exports = i18n;