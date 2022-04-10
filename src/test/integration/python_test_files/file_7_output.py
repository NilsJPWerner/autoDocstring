from __future__ import annotations
from typing import List, Dict

def function(
    arg1: int,
    arg2: List[str] | Dict[str, int] | None,
    kwarg1: int | float = 1
) -> List[str] | Dict[str, int] | None:
    """_summary_

    :param arg1: _description_
    :type arg1: int
    :param arg2: _description_
    :type arg2: List[str] | Dict[str, int] | None
    :param kwarg1: _description_, defaults to 1
    :type kwarg1: int | float, optional
    :return: _description_
    :rtype: List[str] | Dict[str, int] | None
    """
    return arg2
