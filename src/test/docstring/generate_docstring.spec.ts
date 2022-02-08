import chai = require("chai");
import "mocha";
import { DocstringFactory } from "../../docstring/docstring_factory";
import { DocstringParts } from "../../docstring_parts";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("DocstringFactory", () => {
    describe("generateDocstring()", () => {
        context("when instantiated with a template with placeholder tags", () => {
            it("should add numerically increasing snippet placeholders", () => {
                const template =
                    "{{#placeholder}}first{{/placeholder}}\n{{#placeholder}}second{{/placeholder}}";
                const docstringComponents = defaultDocstringComponents;

                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal('"""${1:first}\n${2:second}"""');
            });

            it("should use docstring components in the placeholders", () => {
                const template = "{{#placeholder}}--{{name}}--{{/placeholder}}";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.name = "Function";

                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal('"""${1:--Function--}"""');
            });
        });

        context("when a non existent field is used in the template", () => {
            it("should ignore the tag", () => {
                const template = "{{name}} {{not_a_valid_tag}} hello";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.name = "Function";
                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal('"""Function  hello"""');
            });
        });

        it("should create a summary placeholder", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.name = "Function";
            const factory = new DocstringFactory("{{summaryPlaceholder}}");

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""${1:[summary]}"""');
        });

        it("should use the docstring name if the template specifies it", () => {
            const template = "{{name}} abc";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.name = "Function";
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""Function abc"""');
        });

        it("should iterate over docstring decorators", () => {
            const template = "{{#decorators}}\n{{name}}\n{{/decorators}}";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.decorators = [{ name: "decorator_1" }, { name: "decorator_2" }];
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""decorator_1\ndecorator_2\n"""');
        });

        it("should iterate over docstring args", () => {
            const template = "{{#args}}{{var}} {{type}}\n{{/args}}";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.args = [
                { var: "arg_1", type: "string" },
                { var: "arg_2", type: "number" },
            ];
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""arg_1 string\narg_2 number\n"""');
        });

        it("should iterate over docstring kwargs", () => {
            const template = "{{#kwargs}}\n{{var}} {{type}} {{default}}\n{{/kwargs}}";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.kwargs = [
                { var: "kwarg_1", type: "string", default: "1" },
                { var: "kwarg_2", type: "number", default: "text" },
            ];
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""kwarg_1 string 1\nkwarg_2 number text\n"""');
        });

        it("should iterate over docstring exceptions components", () => {
            const template = "{{#exceptions}}\n{{type}}\n{{/exceptions}}";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.exceptions = [{ type: "Error_1" }, { type: "Error_2" }];
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""Error_1\nError_2\n"""');
        });

        it("should use the docstring returns if the template specifies it", () => {
            const template = "{{returns.type}} yay";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.returns = { type: "Thing" };
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""Thing yay"""');
        });

        it("should condense multiple newlines to two newlines", () => {
            const template = "Thing\n\n\nHello\n\n\n\nAgain!";
            const docstringComponents = defaultDocstringComponents;
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal('"""Thing\n\nHello\n\nAgain!"""');
        });

        it("should condense trailing newlines to a single newline", () => {
            const template = "abc\n\nabc\n\n";
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(defaultDocstringComponents);

            expect(result).to.equal('"""abc\n\nabc\n"""');
        });

        context("when guessTypes is set to false", () => {
            it("should not use the types from the docstring", () => {
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.args = [{ var: "arg_1", type: "string" }];
                docstringComponents.kwargs = [{ var: "kwarg_1", type: "string", default: "abc" }];
                docstringComponents.returns = { type: "Thing" };

                const factory = new DocstringFactory(
                    noTypesTemplate,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    false,
                );

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal('"""arg_1 [type]\nkwarg_1 [type]\nreturns [type]"""');
            });
        });

        context("when quoteStyle is set to ''' ", () => {
            it("should wrap the returned snippet in '''", () => {
                const template = "{{name}} hello";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.name = "Function";
                const factory = new DocstringFactory(template, "'''");

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("'''Function hello'''");
            });
        });

        context("when startOnNewLine is set to true", () => {
            it("should add a new line at the beginning of the docstring", () => {
                const template = "{{name}} hello";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.name = "Function";
                const factory = new DocstringFactory(template, undefined, true);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal('"""\nFunction hello"""');
            });
        });

        context("when the extendedSummaryPlaceholder is used in the template", () => {
            const template = "Doc\n\n{{extendedSummaryPlaceholder}}\n\nHello";

            context("and includeExtendedSummary is set to true", () => {
                it("should add the extended_summary placeholder to the snippet", () => {
                    const factory = new DocstringFactory(template, undefined, undefined, true);

                    const result = factory.generateDocstring(defaultDocstringComponents);

                    expect(result).to.equal('"""Doc\n\n${1:[extended_summary]}\n\nHello"""');
                });
            });

            context("and includeExtendedSummary is set to false", () => {
                it("should not add the extended_summary placeholder to the snippet", () => {
                    const factory = new DocstringFactory(template, undefined, undefined, false);

                    const result = factory.generateDocstring(defaultDocstringComponents);

                    expect(result).to.equal('"""Doc\n\nHello"""');
                });
            });
        });

        context("when the argsExist tag is used", () => {
            const template = "\n{{summaryPlaceholder}}";

            context("and includeName is set to true", () => {
                it("should add the name to the summary", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.name = "Function";
                    const factory = new DocstringFactory(
                        template,
                        undefined,
                        undefined,
                        undefined,
                        true,
                    );

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""\nFunction ${1:[summary]}"""');
                });
            });

            context("and includeName is set to false", () => {
                it("should not add the name to the summary", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.name = "Function";
                    const factory = new DocstringFactory(
                        template,
                        undefined,
                        undefined,
                        undefined,
                        false,
                    );

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""\n${1:[summary]}"""');
                });
            });
        });

        context("when the argsExist tag is used", () => {
            const template = "{{#argsExist}}Args Exist!{{/argsExist}}";

            context("and there are args", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.args = [
                        { var: "var_a", type: "int" },
                        { var: "var_b", type: "string" },
                    ];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""Args Exist!"""');
                });
            });

            context("and there are no args", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.args = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('""""""');
                });
            });
        });

        context("when the kwargsExist tag is used", () => {
            const template = "{{#kwargsExist}}Kwargs Exist!{{/kwargsExist}}";

            context("and there are kwargs", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [
                        { var: "var_a", type: "int", default: "1" },
                        { var: "var_b", type: "string", default: "2" },
                    ];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""Kwargs Exist!"""');
                });
            });

            context("and there are no kwargs", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('""""""');
                });
            });
        });

        context("when the parametersExist tag is used", () => {
            const template = "{{#parametersExist}}Params Exist!{{/parametersExist}}";

            context("and there are kwargs", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [
                        { var: "var_a", type: "int", default: "1" },
                        { var: "var_b", type: "string", default: "2" },
                    ];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""Params Exist!"""');
                });
            });

            context("and there are args", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [
                        { var: "var_a", type: "int", default: "1" },
                        { var: "var_b", type: "string", default: "2" },
                    ];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""Params Exist!"""');
                });
            });

            context("and there are no kwargs or args", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('""""""');
                });
            });
        });

        context("when the exceptionsExist tag is used", () => {
            const template = "{{#exceptionsExist}}Exceptions Exist!{{/exceptionsExist}}";

            context("and there are exceptions", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.exceptions = [
                        { type: "exception_1" },
                        { type: "exception_2" },
                    ];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""Exceptions Exist!"""');
                });
            });

            context("and there are no exceptions", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.exceptions = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('""""""');
                });
            });
        });

        context("when the returnsExist tag is used", () => {
            const template = "{{#returnsExist}}Returns Exist!{{/returnsExist}}";

            context("and there are returns", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.returns = { type: "a" };
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('"""Returns Exist!"""');
                });
            });

            context("and there are no returns", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.returns = undefined;
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal('""""""');
                });
            });
        });

        context("when an indentation is provided", () => {
            it("should prepend the indentation to each line", () => {
                const template = "line1\nline2\nline3";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.returns = { type: "a" };
                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents, "  ");

                expect(result).to.equal('  """line1\n  line2\n  line3"""');
            });

            it("should not prepend the indentation to blank lines", () => {
                const template = "line1\n\nline2";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.returns = { type: "a" };
                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents, "  ");

                expect(result).to.equal('  """line1\n\n  line2"""');
            });
        });
    });
});

const defaultDocstringComponents: DocstringParts = {
    name: "",
    decorators: [],
    args: [],
    kwargs: [],
    exceptions: [],
    returns: { type: "" },
    yields: { type: "" },
    classes: [],
    methods: [],
    attributes: []
};

const noTypesTemplate = `{{#args}}{{var}} {{type}}{{/args}}
{{#kwargs}}{{var}} {{type}}{{/kwargs}}
returns {{returns.type}}`;
