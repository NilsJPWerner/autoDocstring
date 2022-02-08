from __future__ import annotations


def function(
    arg1: int,
    arg2: list[str] | dict[str, int] | Thing,
    kwarg1: int | float = 1
) -> list[str] | dict[str, int] | Thing:
    """[summary]

    :param arg1: [description]
    :type arg1: int
    :param arg2: [description]
    :type arg2: list[str] | dict[str, int] | Thing
    :param kwarg1: [description], defaults to 1
    :type kwarg1: int | float, optional
    :return: [description]
    :rtype: list[str] | dict[str, int] | Thing
    """
    return arg2
