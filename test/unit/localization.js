"use strict";

module("localization");

test("jQuery.fn.localize() works", function() {
  var div = jQuery('<div><span data-l10n="blargy:fnargy"></span></div>');
  jQuery.localization.extend("en", "blargy", {
    "fnargy": "hallo"
  });
  div.localize(jQuery.localization.createLocale(["en"]));
  equal(div.find("span").text(), "hallo");
});

test("createLocale() inherits from non-region locales", function() {
  jQuery.localization.extend("en", "l10nTests", {
    "hey": "there",
    "u": "2"
  });
  jQuery.localization.extend("en-CA", "l10nTests", {
    "u": "3"
  });
  var locale = jQuery.localization.createLocale(["en-CA"]);
  equal(locale.get("l10nTests:hey"), "there",
        "fallback to non-region-specific l10n works");
  equal(locale.get("l10nTests:u"), "3",
        "region-specific l10n takes precedence");
});

test("createLocale() normalizes language codes", function() {
  jQuery.localization.extend("en-US", "l10nTests", {
    "foo": "bar",
  });
  var locale = jQuery.localization.createLocale(["en-us"]);
  deepEqual(locale.languages, ["en-US"]);
  equal(locale.get("l10nTests:foo"), "bar");
});

test("getting names inherits from different languages", function() {
  jQuery.localization.extend("en-US", "l10nTests", {
    "about": "about",
    "inherited-msg": "This should pass through!"
  });
  jQuery.localization.extend("en-CA", "l10nTests", {
    "about": "aboot"
  });
  var locale = jQuery.localization.createLocale(["en-US", "en-CA"]);
  equal(locale.get("l10nTests:about"), "aboot");
  equal(locale.get("l10nTests:inherited-msg"), "This should pass through!");
});

test("scope function works w/ nonexistent scope", function() {
  var locale = jQuery.localization.createLocale(["uu-UU"]);
  var l10n = locale.scope("nonexistent");
  
  equal(l10n("foo"), "unable to find locale string nonexistent:foo");
});
