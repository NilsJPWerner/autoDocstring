from __future__ import annotations


def function(
    arg1: int,
    arg2: list[str] | dict[str, int] | Thing,
    kwarg1: int = 1
) -> Generator[tuple[str, str]]:
    """[summary]

    :param arg1: [description]
    :type arg1: int
    :param arg2: [description]
    :type arg2: list[str] | dict[str, int] | Thing
    :param kwarg1: [description], defaults to 1
    :type kwarg1: int, optional
    :yield: [description]
    :rtype: Generator[tuple[str, str]]
    """
    yield ("abc", "def")
