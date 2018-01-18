# Python autoDocstring

Visual Studio Code extension to quickly generate docstrings for python functions.

![Auto Generate Docstrings](images/demo.gif)

## Features

* Quickly generate a docstring snippet that can be tabbed through.
* Choose between several different types of docstring formats.
* Support for args, kwargs, decorators, errors, and paramter types
* More to come!

## Docstring Formats

* Default (docBlockr)
* Google
* Numpy
* Sphinx
* PEP0257 (coming soon)

## Usage
Cursor must be on the line directly below the definition to generate full auto-populated docstring

* Press enter after opening docstring with triple quotes (""")
* Keyboard shortcut: `ctrl+shift+2` or `cmd+shift+2` for mac
    - Can be changed in Preferences -> Keyboard Shortcuts -> extension.generateDocstring
* Command: `Generate Docstring`
* Right click menu: `Generate Docstring`

## Extension Settings

This extension contributes the following settings:

* `autoDocstring.docstringFormat`: Switch between different docstring formats
* `autoDocstring.generateDocstringOnEnter`: Generate the docstring on pressing enter after opening docstring
* `autoDocstring.includeDescription`: Include dscription section in docstring

## Known Issues
* Definition parser does not take into account commas in kwarg string or tuple defaults

## Roadmap

* Add support for classes and modules
* Add unit tests
* Add ability to infer types
* Document code better
* Add more docstring formats

## Changelog

Check the [CHANGELOG.md](CHANGELOG.md) for any version changes.

## Contributing

The source code for this extension is hosted on [GitHub](https://github.com/NilsJPWerner/autoDocstring). Contributions, pull requests, suggestions, and bug reports are greatly appreciated.

* Post any issues and suggestions to the github [issues page](https://github.com/NilsJPWerner/autoDocstring/issues). Add the `feature request` tage to any feature requests or suggestions.
* To contribute, fork the project and then create a pull request back to master. Please update the README if you make any noticeable feature changes.
* There is no official contribution guide or code of conduct yet, but please follow the standard open source norms and be respectful in any comments you make.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
