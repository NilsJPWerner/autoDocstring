# Change Log

## [0.5.5] - 2021-01-17

-   Added class and module docstrings (@tracetidwell)

## [0.5.4] - 2020-11-17

-   Added Starlark support #139 (@UebelAndre)
-   Fixed bug: Ignore "raise" in comments #138 (@bastienboutonnet)
-   Fixed bug: Discard lines that are only comments #146 (@HaaLeo)

## [0.5.3] - 2020-06-03

-   Changed default docstring type to google
-   Added better logging and stack traces for errors
-   Fixed bug: Comments in multiline function definition are not ignored #77
-   Fixed bug: Parse quoted type hints #138 (@bastienboutonnet)
-   Fixed bug: Parsing fails when activated on first line #139
-   Fixed bug: Unclear error when a document type is not supported. e.g. notebooks

## [0.5.2] - 2020-05-17

-   Fixed bug: Multiline function definitions are not parsed correctly #74
-   Fixed bug: No indentation if function is blank #117 (@rileypeterson)
-   Fixed bug: CompletionItem not appearing after triple single quote #125

## [0.5.1] - 2020-04-28

-   Fixed bug: No completion item in CRLF documents #118

## [0.5.0] - 2020-04-21

-   Added remote usage capabilities
-   Switched to completionItem API and improved activation detection
-   Added integration tests
-   Fixed bug: Trailing whitespace on blank lines #99
-   Fixed bug: Lines are parsed after end of function
-   Fixed bug: Wrong docstring for yield-only generator #91 (@HaaLeo)
-   Fixed bug: Comments in definition cause parsing errors #110

## [0.4.0] - 2019-11-13

-   Omit `-> None` return annotation (@HaaLeo)
-   Add support for yields (@HaaLeo)
-   Add support for relative paths in `customTemplatePath` configuration (@s-kovacevic)
-   Indent correctly on `> Generate Docstring` command

## [0.3.0] - 2019-04-16

-   Switched to mustache.js for templating
-   Added support for custom templating
-   Fixed bug - newline after generating docstring

## [0.2.3] - 2018-07-23

-   Added support for single quotes (@Modelmat)
-   Bugfixes (@chirieac, @md2perpe)

## [0.2.1] - 2018-04-15

-   Bugfixes
-   Added includeName option to include function name in docstring
-   Added newlineBeforeSummary option
-   Removed test functions from install script

## [0.2.0] - 2018-02-28

-   Rewrote parser to tokenize parameters. Should deal with string and array kwargs better
-   Added type inference using type hints, kwarg defaults, and var names
-   Improved the closed docstring check
-   Added unit tests for parser

## [0.1.4] - 2018-01-17

-   Add Sphinx and Numpy formatters

## [0.1.3] - 2018-01-01

-   Bugfixes
-   Better documentation
-   Fixed parsers

## [0.1.2] - 2017-11-22

-   Changed name, added logo, cleaned up readme, and added explanatory gif
-   Will get better at change logs!

## [0.1.0] - 2017-11-18

-   Supports google and typed PEP0257 style docstrings
-   Supports automatic creation on enter after triple quotes
-   Supports activation through context menu and command palette
