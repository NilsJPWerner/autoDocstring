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
                const template = "{{#placeholder}}first{{/placeholder}}\n{{#placeholder}}second{{/placeholder}}";
                const docstringComponents = defaultDocstringComponents;

                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"${1:first}\n${2:second}\"\"\"");
            });

            it("should use docstring components in the placeholders", () => {
                const template = "{{#placeholder}}--{{name}}--{{/placeholder}}";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.name = "Function";

                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"${1:--Function--}\"\"\"");
            });
        });

        context("when a non existent field is used in the template", () => {
            it("should ignore the tag", () => {
                const template = "{{name}} {{not_a_valid_tag}} hello";
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.name = "Function";
                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"Function  hello\"\"\"");
            });
        });

        it("should create a summary placeholder", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.name = "Function";
            const factory = new DocstringFactory("{{summaryPlaceholder}}");

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"${1:[summary]}\"\"\"");
        });

        it("should use the docstring name if the template specifies it", () => {
            const template = "{{name}} abc";
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.name = "Function";
            const factory = new DocstringFactory(template);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Function abc\"\"\"");
        });

        it("should iterate over docstring decorators", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.decorators = [
                { name: "decorator_1" },
                { name: "decorator_2" },
            ];
            const factory = new DocstringFactory(decoratorTemplate);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"decorator_1\ndecorator_2\n\"\"\"");
        });

        it("should iterate over docstring args", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.args = [
                { var: "arg_1", type: "string" },
                { var: "arg_2", type: "number" },
            ];
            const factory = new DocstringFactory(argTemplate);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"arg_1 string\narg_2 number\n\"\"\"");
        });

        it("should iterate over docstring kwargs", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.kwargs = [
                { var: "kwarg_1", type: "string", default: "1" },
                { var: "kwarg_2", type: "number", default: "text" },
            ];
            const factory = new DocstringFactory(kwargTemplate);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"kwarg_1 string 1\nkwarg_2 number text\n\"\"\"");
        });

        it("should iterate over docstring exceptions components", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.exceptions = [
                { type: "Error_1" },
                { type: "Error_2" },
            ];
            const factory = new DocstringFactory(exceptionsTemplate);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Error_1\nError_2\n\"\"\"");
        });

        it("should use the docstring returns if the template specifies it", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.returns = { type: "Thing" };
            const factory = new DocstringFactory(returnsTemplate);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Thing yay\"\"\"");
        });

        it("should remove extraneous newlines if a component is unused", () => {
            const docstringComponents = defaultDocstringComponents;
            docstringComponents.kwargs = [];
            docstringComponents.args = [];
            const factory = new DocstringFactory(unusedComponentsTemplate);

            const result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Thing\n\nHello\n\nAgain!\"\"\"");
        });

        context("when guessTypes is set to false", () => {
            it("should not use the types from the docstring", () => {
                const docstringComponents = defaultDocstringComponents;
                docstringComponents.args = [{ var: "arg_1", type: "string" }];
                docstringComponents.kwargs = [{ var: "kwarg_1", type: "string", default: "abc" }];
                docstringComponents.returns = { type: "Thing" };

                const factory = new DocstringFactory(
                    noTypesTemplate, undefined, undefined, undefined, undefined, false);

                const result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"arg_1 [type]\nkwarg_1 [type]\nreturns [type]\"\"\"");
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

                expect(result).to.equal("\"\"\"\nFunction hello\"\"\"");
            });
        });

        context("when the extendedSummaryPlaceholder is used in the template", () => {
            const template = "Doc\n\n{{extendedSummaryPlaceholder}}\n\nHello";

            context("and includeExtendedSummary is set to true", () => {
                it("should add the extended_summary placeholder to the snippet", () => {
                    const factory = new DocstringFactory(template, undefined, undefined, true);

                    const result = factory.generateDocstring(defaultDocstringComponents);

                    expect(result).to.equal("\"\"\"Doc\n\n${1:[extended_summary]}\n\nHello\"\"\"");
                });
            });

            context("and includeExtendedSummary is set to false", () => {
                it("should not add the extended_summary placeholder to the snippet", () => {
                    const factory = new DocstringFactory(template, undefined, undefined, false);

                    const result = factory.generateDocstring(defaultDocstringComponents);

                    expect(result).to.equal("\"\"\"Doc\n\nHello\"\"\"");
                });
            });
        });

        context("when the argsExist tag is used", () => {
            const template = "\n{{summaryPlaceholder}}\n";

            context("and includeName is set to true", () => {
                it("should add the name to the summary", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.name = "Function";
                    const factory = new DocstringFactory(template, undefined, undefined, undefined, true);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\nFunction ${1:[summary]}\n\"\"\"");
                });
            });

            context("and includeName is set to false", () => {
                it("should not add the name to the summary", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.name = "Function";
                    const factory = new DocstringFactory(template, undefined, undefined, undefined, false);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\n${1:[summary]}\n\"\"\"");
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

                    expect(result).to.equal("\"\"\"Args Exist!\"\"\"");
                });
            });

            context("and there are no args", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.args = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\"\"\"");
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

                    expect(result).to.equal("\"\"\"Kwargs Exist!\"\"\"");
                });
            });

            context("and there are no kwargs", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\"\"\"");
                });
            });
        });

        context("when the paramsExist tag is used", () => {
            const template = "{{#paramsExist}}Params Exist!{{/paramsExist}}";

            context("and there are kwargs", () => {
                it("should include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [
                        { var: "var_a", type: "int", default: "1" },
                        { var: "var_b", type: "string", default: "2" },
                    ];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"Params Exist!\"\"\"");
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

                    expect(result).to.equal("\"\"\"Params Exist!\"\"\"");
                });
            });

            context("and there are no kwargs or args", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.kwargs = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\"\"\"");
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

                    expect(result).to.equal("\"\"\"Exceptions Exist!\"\"\"");
                });
            });

            context("and there are no exceptions", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.exceptions = [];
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\"\"\"");
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

                    expect(result).to.equal("\"\"\"Returns Exist!\"\"\"");
                });
            });

            context("and there are no returns", () => {
                it("should not include the content inside the tag", () => {
                    const docstringComponents = defaultDocstringComponents;
                    docstringComponents.returns = undefined;
                    const factory = new DocstringFactory(template);

                    const result = factory.generateDocstring(docstringComponents);

                    expect(result).to.equal("\"\"\"\"\"\"");
                });
            });
        });

        context("when the noOpeningQuotes is set to true", () => {
            it("should not add opening quotes to snippet", () => {
                const template = "docstring";
                const docstringComponents = defaultDocstringComponents;
                const factory = new DocstringFactory(template);

                const result = factory.generateDocstring(docstringComponents, true);

                expect(result).to.equal("docstring\"\"\"");
            });
        });
    });
});

const defaultDocstringComponents: DocstringParts = {
    name: "",
    decorators: [],
    args: [],
    kwargs: [],
    returns: { type: "" },
    exceptions: [],
};

const decoratorTemplate = `{{#decorators}}
{{name}}
{{/decorators}}`;

const argTemplate = `{{#args}}
{{var}} {{type}}
{{/args}}`;

const kwargTemplate = `{{#kwargs}}
{{var}} {{type}} {{default}}
{{/kwargs}}`;

const exceptionsTemplate = `{{#exceptions}}
{{type}}
{{/exceptions}}`;

const returnsTemplate = `{{returns.type}} yay`;

const unusedComponentsTemplate = `Thing

{{#kwargs}}
{{var}} {{type}} {{default}}
{{/kwargs}}

Hello

{{#args}}
{{var}} {{type}}
{{/args}}

Again!`;

const noTypesTemplate = `{{#args}}{{var}} {{type}}{{/args}}
{{#kwargs}}{{var}} {{type}}{{/kwargs}}
returns {{returns.type}}`;
