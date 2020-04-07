
def function(arg1, arg2, kwarg1=1):

    if arg2 > 1:
        raise FileExistsError()

    yield 1
    return arg1
