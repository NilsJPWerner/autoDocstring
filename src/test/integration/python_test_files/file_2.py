from typing import Union, List, Generator, Tuple, Dict


def function(
    arg1: int,
    arg2: Union[List[str], Dict[str, int], Thing],
    kwarg1: int = 1
) -> Generator[Tuple[str, str]]:

    yield ("abc", "def")
