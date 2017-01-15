var lang = 'es';

function jsToPHP(value) {

  switch(typeof(value)) {
    case 'undefined':
      return 'null';
    break;
    case 'object':
      var answer = 'array(';
      var first = true;
      for(key in value) {
        if(!first) {
          answer += ", ";
        }
        answer += '"' + key + '" => ' + jsToPHP(value[key]);
        first = false;
      }
      answer += ')';
      return answer;
    break;
    case 'boolean':
      if(value) {
        return 'TRUE';
      } else {
        return 'FALSE';
      }
    break;
    case 'number':
      return value;
    break;
    case 'string':
      return '"' + value + '"';
    break;
    case 'symbol':
      return '"' + value + '"';
    break;
    case 'function':
      return value();
    break;
  }
}

function url(path, options) {

  var parts = path.split('#');
  var path = parts[0];
  var fragment = null;
  if(parts.length > 1) {
    if(options === undefined) {
      options = {};
    }
    options['fragment'] = parts[1];
  }
  if(options !== undefined && options['language'] !== undefined) {
    var lang = options['language'];
    options['language'] = function(){ return 'i18n_language_load("' + lang + '")'};
  }
  if(path === '') {
    path = '<front>';
  }

  if(options !== undefined) {
    options_str = ', ' + jsToPHP(options);
  } else {
    options_str = '';
  }
  return '<?php print url(\'' + path + '\'' + options_str + ');?>';
}

function asset(path) {

  return '<?php print url(\'sites/default/assets/' + path + '\', array("language" => (object)array("language" => FALSE)));?>';
}

var obfuscate_key = "RYliAnk19vSIf0cP2abuWd6zryFm4ohV7GDNeBKQwCtsLXUJqET8OHpZ5Mxg3j";

function obfuscate(string, key) {

  if(key == undefined) {
    key = obfuscate_key;
  }

  answer = "";

  for (i=0; i<string.length; i++) {
    if (key.indexOf(string.charAt(i)) == -1 ) {
      answer += string.charAt(i);
    } else {
      chr = (key.indexOf(string.charAt(i)) + string.length) % key.length;
      answer += key.charAt(chr);
    }
  }

  return answer;
}

function deobfuscate(string, key) {

  answer = '';

  for (i=0; i<string.length; i++) {
    if (key.indexOf(string.charAt(i)) == -1 ) {
      chr = string.charAt(i);
      answer += (chr);
    } else {
      chr = (key.indexOf(string.charAt(i)) - string.length + key.length) % key.length;
      answer += (key.charAt(chr));
    }
  }

  return answer;
}

function deobfuscate_mailto(string, key) {
  return "<a class='mailto' href='mailto:" + deobfuscate(string, key) + "'>" + deobfuscate(string, key) + "</a>";
}

function obf_email(address) {
  return "<script type='text/javascript'>document.write(deobfuscate_mailto('" + obfuscate(address) + "', '" + obfuscate_key + "'));</script>";
}

function obf_email_init() {
  return "<script type='text/javascript'>" + String(deobfuscate) + '; ' + String(deobfuscate_mailto) + "</script>";
}

var localized_strings = require('./strings.js')

function str(id) {
  if(localized_strings[id] != undefined && localized_strings[id][lang] != undefined) {
    return localized_strings[id][lang];
  } else {
    return '<?php print t(\'' + id + '\');?>';
  }
}

function setLang(code) {
  lang = code;
}

function getLang() {
  return lang;
}

module.exports = {
  jsToPHP: jsToPHP,
  url: url,
  asset: asset,
  obf_email: obf_email,
  obf_email_init: obf_email_init,
  str: str,
  setLang: setLang,
  getLang: getLang
};