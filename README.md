# autoDocstring

Visual Studio Code extension to quickly generate docstrings for python functions.

![Auto Generate Docstrings](images/demo.gif)

## Features

* Quickly generate a docstring snippet that can be tabbed through.
* Choose between several different types of docstring formats.
* Support for args, kwargs, decorators, errors, and paramter types
* More to come!

## Docstring Formats

* Default (typed PEP0257)
* PEP0257
* Google

### Coming Soon
* Numpy
* Sphinx

## Usage
Cursor must be on the line directly below the definition to generate full auto-populated docstring

* Press enter after opening docstring with triple quotes (""")
* Keyboard shortcut: `cmd+shift+2`
* Command: `Generate Docstring`
* Right click menu: `Generate Docstring`

## Extension Settings

This extension contributes the following settings:

* `autoDocstring.docstringFormat`: Switch between different docstring formats
* `autoDocstring.generateDocstringOnEnter`: Generate the docstring on pressing enter after opening docstring
* `autoDocstring.includeDescription`: Include dscription section in docstring

## Known Issues
* Definition parser does not take into account commas in kwarg string or tuple defaults
* Parser does not handle multiline function defintions
* Parse cannot handle PEP484 type hinting

## Roadmap

* Add support for classes and modules
* Add unit tests
* Add ability to infer types
* Document code better
* Add more docstring formats


## Release Notes

### 0.1.0

* Initial release
* Support for python functions
* Several activation methods
