console.log("Start")

// var code = 'def func("123,4", "(12)", kwarg=(1, (2,4))):';
var code = '( " 123,4", "(12)", kwarg=(1, (2,4))';

console.log(splitArgs(code))

function getArgs(definition) {

}


function splitArgs(args) {

    var stack = [')'];
    var args = [];
    var arg = "";

    var position = code.length - 1;

    while (stack.length > 0 && position >= 0) {

        var top = stack[stack.length - 1];
        var char = code.charAt(position);

        // Add support for string literals, '<' char, and error management
        switch (true) {
            // 1. Check for top level comma and push arg to array
            case char == ',' && stack.length == 1:
                args.push(arg);
                arg = "";
                position -= 1;
                continue;

            // 2. Check for closing double or single quote of string
            case char == '"' && top == '"':
                stack.pop();
                break;
            case char == '\'' && top == '\'':
                stack.pop();
                break;

            // 3.  Do nothing if quote at the top of stack
            case top == '"':
                break;
            case top == '\'':
                break;

            // 4. Push single and double quotes to stack
            case char == '"':
                stack.push('"');
                break;
            case char == '\'':
                stack.push('\'');
                break;

            // 5. Check for closing of tuples, arrays, or dicts
            case char == '(' && top == ')':
                stack.pop();
                break;
            case char == '[' && top == ']':
                stack.pop();
                break;
            case char == '{' && top == '}':
                stack.pop();
                break;

            // 6. Error out if closing char but no matching char on stack
            case char == ')':
                stack.push(')');
                break;
            case char == ']':
                stack.push(']');
                break;
            case char == '[':
                console.log("ERROR");
                break;

            // 7. Push opening char to stack
            case char == '(':
                console.log("ERROR");
                break;
            case char == '[':
                console.log("ERROR");
                break;
            case char == '}':
                stack.push('}');
                break;

            // 8. Disregard whitespace at top level of stack
            case char == ' ' && stack.length == 1:
                position -= 1;
                continue;
        }

        arg = char + arg;
        position -= 1;
    }

    args.push(arg);

    return args;
}

