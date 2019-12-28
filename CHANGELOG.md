# Change Log

## [0.4.1] - Unreleased
- Fixed a bug that caused to create return annotations in yield only iterators (@HaaLeo)

## [0.4.0] - 2019-11-13
- Omit `-> None` return annotation (@HaaLeo)
- Add support for yields (@HaaLeo)
- Add support for relative paths in `customTemplatePath` configuration (@s-kovacevic)
- Indent correctly on `> Generate Docstring` command

## [0.3.0] - 2019-04-16
- Switched to mustache.js for templating
- Added support for custom templating
- Fixed bug - newline after generating docstring

## [0.2.3] - 2018-07-23
- Added support for single quotes (@Modelmat)
- Bugfixes (@chirieac, @md2perpe)

## [0.2.1] - 2018-04-15
- Bugfixes
- Added includeName option to include function name in docstring
- Added newlineBeforeSummary option
- Removed test functions from install script

## [0.2.0] - 2018-02-28
- Rewrote parser to tokenize parameters. Should deal with string and array kwargs better
- Added type inference using type hints, kwarg defaults, and var names
- Improved the closed docstring check
- Added unit tests for parser

## [0.1.4] - 2018-01-17
- Add Sphinx and Numpy formatters

## [0.1.3] - 2018-01-01
- Bugfixes
- Better documentation
- Fixed parsers

## [0.1.2] - 2017-11-22
- Changed name, added logo, cleaned up readme, and added explanatory gif
- Will get better at change logs!

## [0.1.0] - 2017-11-18
- Supports google and typed PEP0257 style docstrings
- Supports automatic creation on enter after triple quotes
- Supports activation through context menu and command palette
