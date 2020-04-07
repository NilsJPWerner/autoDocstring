
def fun(arg1: int) -> str:  # comment
    """[summary]

    :param arg1: [description]
    :type arg1: int
    :raises FileExistsError: [description]
    :return: [description]
    :rtype: str
    """
    if arg1 > 1:
        raise FileExistsError() # comment

    return "abc" # comment
