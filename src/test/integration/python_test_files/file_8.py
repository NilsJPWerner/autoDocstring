
def function(arg1, arg2, kwarg1=1):

    assert arg1 <= 1
    assert (arg2 <= 1 and arg2 >= 0)
    if arg2 > 1:
        raise FileExistsError()

    yield 1
    return arg1
