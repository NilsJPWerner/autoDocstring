
def function(arg1, arg2, kwarg1=1):
    """[summary]

    :param arg1: [description]
    :type arg1: [type]
    :param arg2: [description]
    :type arg2: [type]
    :param kwarg1: [description], defaults to 1
    :type kwarg1: int, optional
    :raises FileExistsError: [description]
    :return: [description]
    :rtype: [type]
    :yield: [description]
    :rtype: [type]
    """
    if arg2 > 1:
        raise FileExistsError()

    yield 1
    return arg1
