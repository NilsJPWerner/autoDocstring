from __future__ import annotations


def function(
    arg1: int,
    arg2: list[str] | dict[str, int] | Thing,
    kwarg1: int = 1
) -> Generator[tuple[str, str]]:

    yield ("abc", "def")
