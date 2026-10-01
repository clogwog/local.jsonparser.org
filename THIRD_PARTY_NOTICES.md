# Third-Party Notices

This project redistributes and builds upon the following third-party components.
All are used and redistributed under their respective licenses.

## Vendored library

**jsoneditor 9.10.5** — Apache License 2.0
<https://github.com/josdejong/jsoneditor>
Copyright (C) 2011-2023 Jos de Jong

Copied unmodified into `vendor/jsoneditor/`:

- `jsoneditor.min.js`
- `jsoneditor.min.css`
- `img/jsoneditor-icons.svg`

A copy of its license and notice is kept at `vendor/jsoneditor/LICENSE` and
`vendor/jsoneditor/NOTICE`, and at the repository root (`LICENSE`, `NOTICE`).

## Bundled inside `jsoneditor.min.js`

The jsoneditor distribution statically bundles the following libraries. Their
notices are preserved within the distributed file.

| Component | License | Copyright / home |
| --- | --- | --- |
| ace-builds (Bundled ace editor) | BSD-3-Clause | © Ajax.org B.V. — <https://github.com/ajaxorg/ace-builds> |
| ajv ^6.12.6 | MIT | © Evgeny Poberezkin — <https://github.com/ajv-validator/ajv> |
| javascript-natural-sort ^0.7.1 | MIT | © Jim Palmer — <https://github.com/overset/javascript-natural-sort> |
| jmespath ^0.16.0 | Apache-2.0 | <https://github.com/jmespath/jmespath.js> |
| json-source-map ^0.6.1 | MIT | <https://github.com/mafintosh/json-source-map> |
| jsonrepair 3.1.0 | ISC | © Jos de Jong — <https://github.com/josdejong/jsonrepair> |
| mobius1-selectr ^2.4.13 | MIT | © Karl Saunders — <https://github.com/Mobius1/Selectr> |
| picomodal ^3.0.0 | MIT | <https://github.com/verlok/picomodal> |
| vanilla-picker ^2.12.2 | ISC | © Andreas Borgen — <https://github.com/mdbassit/vanilla-picker> |
| uri-js 4.4.1 (bundled) | BSD-2-Clause | © 2011 Gary Court — <https://github.com/garycourt/uri-js> |
| RequireJS text 0.25.0 (bundled) | MIT | © 2010-2011 The Dojo Foundation — <https://github.com/requirejs/text> |

## Icon

The extension/toolbar icon (`icons/`) is derived from the Material Design Icons
`code-json` glyph.

**Material Design Icons** — Apache License 2.0
<https://github.com/Templarian/MaterialDesign>
Copyright (C) Pictogrammers

It is recolored and composited onto a background by this project.

## Notes

- No vendored or bundled third-party source files have been modified.
- This project's own code (everything outside `vendor/`) is licensed under the
  Apache License 2.0 as well; see `LICENSE`.
