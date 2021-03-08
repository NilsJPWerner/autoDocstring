"""[summary]

Classes
-------
TestClass

Methods
-------
function_1
function_2
function_3
"""
from typing import Union, List, Dict, Thing, Generator, Tuple


class TestClass(object):

    def __init__(self, arg1: int, arg2: str, arg3: float = None):
        self.arg1 = arg1
        self.arg2 = arg2
        self.arg3 = arg3
        self.arg4 = self._get_arg4()

    def _get_arg4(self):
        return 4


def function_1(arg1: int) -> str:  # comment

    if arg1 > 1:
        raise FileExistsError() # comment

    return "abc" # comment


def function_2(arg1, arg2, kwarg1=1):

    if arg2 > 1:
        raise FileExistsError()

    yield 1
    return arg1


def function_3(
    arg1: int,
    arg2: Union[List[str], Dict[str, int], Thing],
    kwarg1: int = 1
) -> Generator[Tuple[str, str]]:

    yield ("abc", "def")
