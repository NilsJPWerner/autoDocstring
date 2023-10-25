# Change Log

## Unreleased

-   Added doxygen format support ([#120](https://github.com/NilsJPWerner/autoDocstring/issues/120)) (@daluar @PhilipNelson5)

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.6.1...master)

## [0.6.1](https://github.com/NilsJPWerner/autoDocstring/tree/v0.6.1) - 2022-02-15

-   Rename oneline-rst to one-line-sphinx
-   Remove oneline-rst-notypes as provided format
-   Documentation: Add examples of docstrings formats ([#224](https://github.com/NilsJPWerner/autoDocstring/issues/224))

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.5.4...v0.6.0)

## [0.6.0](https://github.com/NilsJPWerner/autoDocstring/tree/v0.6.0) - 2022-02-13

-   Added one line sphinx format support ([#169](https://github.com/NilsJPWerner/autoDocstring/issues/169)) (@sam-hoffman @afarntrog)
-   Switched to github actions ([#214](https://github.com/NilsJPWerner/autoDocstring/issues/214)) (@s-weigand)
-   Switched placeholder wrapper from square brackets to underscore ([#220](https://github.com/NilsJPWerner/autoDocstring/issues/220))
-   Add untyped versions of docstring formats ([#209](https://github.com/NilsJPWerner/autoDocstring/issues/209)) (@Lef-F)
-   Updated javascript dependencies ([#222](https://github.com/NilsJPWerner/autoDocstring/issues/222))
-   Added more extensive debug logging
-   Added PEP 604 type hint support for pipes ([#218](https://github.com/NilsJPWerner/autoDocstring/issues/218)) (@s-weigand)
-   Fixed bug: Broken quoted type hint forward references ([#157](https://github.com/NilsJPWerner/autoDocstring/issues/157)) (@IniasP)
-   Fixed bug: Extra underscore in numpy template ([#216](https://github.com/NilsJPWerner/autoDocstring/issues/216)) (@s-weigand)
-   Fixed bug: Extra newlines between sections in some cases ([#203](https://github.com/NilsJPWerner/autoDocstring/issues/203)) (@shaperilio)
-   Fixed bug: Incorrectly parses Literal type hints ([#223](https://github.com/NilsJPWerner/autoDocstring/issues/223))
-   Documentation: Quotes clarification ([#211](https://github.com/NilsJPWerner/autoDocstring/issues/211)) (@johschmitz)

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.5.4...v0.6.0)

## [0.5.4](https://github.com/NilsJPWerner/autoDocstring/tree/v0.5.4) - 2020-11-17

-   Added Starlark support ([#139](https://github.com/NilsJPWerner/autoDocstring/issues/139)) (@UebelAndre)
-   Fixed bug: Ignore "raise" in comments ([#138](https://github.com/NilsJPWerner/autoDocstring/issues/138)) (@bastienboutonnet)
-   Fixed bug: Discard lines that are only comments ([#146](https://github.com/NilsJPWerner/autoDocstring/issues/146)) (@HaaLeo)

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.5.3...v0.5.4)

## [0.5.3](https://github.com/NilsJPWerner/autoDocstring/tree/v0.5.3) - 2020-06-03

-   Changed default docstring type to google
-   Added better logging and stack traces for errors
-   Fixed bug: Comments in multiline function definition are not ignored ([#77](https://github.com/NilsJPWerner/autoDocstring/issues/77))
-   Fixed bug: Parse quoted type hints ([#138](https://github.com/NilsJPWerner/autoDocstring/issues/138)) (@bastienboutonnet)
-   Fixed bug: Parsing fails when activated on first line ([#139](https://github.com/NilsJPWerner/autoDocstring/issues/139))
-   Fixed bug: Unclear error when a document type is not supported. e.g. notebooks

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.5.2...v0.5.3)

## [0.5.2](https://github.com/NilsJPWerner/autoDocstring/tree/v0.5.2) - 2020-05-17

-   Fixed bug: Multiline function definitions are not parsed correctly ([#74](https://github.com/NilsJPWerner/autoDocstring/issues/74))
-   Fixed bug: No indentation if function is blank ([#117](https://github.com/NilsJPWerner/autoDocstring/issues/117)) (@rileypeterson)
-   Fixed bug: CompletionItem not appearing after triple single quote ([#125](https://github.com/NilsJPWerner/autoDocstring/issues/125))

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.5.1...v0.5.2)

## [0.5.1](https://github.com/NilsJPWerner/autoDocstring/tree/v0.5.1) - 2020-04-28

-   Fixed bug: No completion item in CRLF documents ([#118](https://github.com/NilsJPWerner/autoDocstring/issues/118))

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.5.0...v0.5.1)

## [0.5.0](https://github.com/NilsJPWerner/autoDocstring/tree/v0.5.0) - 2020-04-21

-   Added remote usage capabilities
-   Switched to completionItem API and improved activation detection
-   Added integration tests
-   Fixed bug: Trailing whitespace on blank lines ([#99](https://github.com/NilsJPWerner/autoDocstring/issues/99))
-   Fixed bug: Lines are parsed after end of function
-   Fixed bug: Wrong docstring for yield-only generator ([#91](https://github.com/NilsJPWerner/autoDocstring/issues/91)) (@HaaLeo)
-   Fixed bug: Comments in definition cause parsing errors ([#110](https://github.com/NilsJPWerner/autoDocstring/issues/110))

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.4.0...v0.5.0)

## [0.4.0](https://github.com/NilsJPWerner/autoDocstring/tree/v0.4.0) - 2019-11-13

-   Omit `-> None` return annotation (@HaaLeo)
-   Add support for yields (@HaaLeo)
-   Add support for relative paths in `customTemplatePath` configuration (@s-kovacevic)
-   Indent correctly on `> Generate Docstring` command

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.3.0...v0.4.0)

## [0.3.0](https://github.com/NilsJPWerner/autoDocstring/tree/v0.3.0) - 2019-04-16

-   Switched to mustache.js for templating
-   Added support for custom templating
-   Fixed bug - newline after generating docstring

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.2.3...v0.3.0)

## [0.2.3](https://github.com/NilsJPWerner/autoDocstring/tree/v0.2.3) - 2018-07-23

-   Added support for single quotes (@Modelmat)
-   Bugfixes (@chirieac, @md2perpe)

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.2.1...v0.2.3)

## [0.2.1](https://github.com/NilsJPWerner/autoDocstring/tree/v0.2.1) - 2018-04-15

-   Bugfixes
-   Added includeName option to include function name in docstring
-   Added newlineBeforeSummary option
-   Removed test functions from install script

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.2.1...v0.2.3)

## [0.2.0](https://github.com/NilsJPWerner/autoDocstring/tree/v0.2.0) - 2018-02-28

-   Rewrote parser to tokenize parameters. Should deal with string and array kwargs better
-   Added type inference using type hints, kwarg defaults, and var names
-   Improved the closed docstring check
-   Added unit tests for parser

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.1.4...v0.2.0)

## [0.1.4](https://github.com/NilsJPWerner/autoDocstring/tree/v0.1.4) - 2018-01-17

-   Add Sphinx and Numpy formatters

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.1.3...v0.1.4)

## [0.1.3](https://github.com/NilsJPWerner/autoDocstring/tree/v0.1.3) - 2018-01-01

-   Bugfixes
-   Better documentation
-   Fixed parsers

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.1.2...v0.1.3)

## [0.1.2](https://github.com/NilsJPWerner/autoDocstring/tree/v0.1.2) - 2017-11-22

-   Changed name, added logo, cleaned up readme, and added explanatory gif
-   Will get better at change logs!

[All Changes](https://github.com/NilsJPWerner/autoDocstring/compare/v0.1.0...v0.1.2)

## [0.1.0](https://github.com/NilsJPWerner/autoDocstring/tree/v0.1.0) - 2017-11-18

-   Supports google and typed PEP0257 style docstrings
-   Supports automatic creation on enter after triple quotes
-   Supports activation through context menu and command palette
