from typing import Union, List


def function(
    arg1: int,
    arg2: Union[List[str], Dict[str, int], Thing],
    kwarg1: int = 1
) -> Generator[Tuple[str, str]]:
    """[summary]

    :param arg1: [description]
    :type arg1: int
    :param arg2: [description]
    :type arg2: Union[List[str], Dict[str, int], Thing]
    :param kwarg1: [description], defaults to 1
    :type kwarg1: int, optional
    :yield: [description]
    :rtype: Generator[Tuple[str, str]]
    """
    yield ("abc", "def")
