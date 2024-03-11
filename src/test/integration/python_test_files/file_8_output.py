
def function(arg1, arg2, kwarg1=1):
    """_summary_

    :param arg1: _description_
    :type arg1: _type_
    :param arg2: _description_
    :type arg2: _type_
    :param kwarg1: _description_, defaults to 1
    :type kwarg1: int, optional
    :raises FileExistsError: _description_
    :asserts arg1 <= 1
    :asserts (arg2 <= 1 and arg2 >= 0)
    :return: _description_
    :rtype: _type_
    :yield: _description_
    :rtype: _type_
    """
    assert arg1 <= 1
    assert (arg2 <= 1 and arg2 >= 0)
    if arg2 > 1:
        raise FileExistsError()

    yield 1
    return arg1
