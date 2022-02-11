
def fun(arg1: int) -> str:  # comment
    """_summary_

    :param arg1: _description_
    :type arg1: int
    :raises FileExistsError: _description_
    :return: _description_
    :rtype: str
    """
    if arg1 > 1:
        raise FileExistsError() # comment

    return "abc" # comment
