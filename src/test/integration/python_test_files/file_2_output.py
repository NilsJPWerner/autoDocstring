from typing import Union, List, Generator, Tuple, Dict


def function(
    arg1: int,
    arg2: Union[List[str], Dict[str, int], Thing],
    kwarg1: int = 1
) -> Generator[Tuple[str, str]]:
    """_summary_

    :param arg1: _description_
    :type arg1: int
    :param arg2: _description_
    :type arg2: Union[List[str], Dict[str, int], Thing]
    :param kwarg1: _description_, defaults to 1
    :type kwarg1: int, optional
    :yield: _description_
    :rtype: Generator[Tuple[str, str]]
    """
    yield ("abc", "def")
