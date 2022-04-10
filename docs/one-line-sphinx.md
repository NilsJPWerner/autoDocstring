# One Line Sphinx Docstring Format

```python
def abc(a: int, c = [1,2]):
    """_summary_

    :param int a: _description_
    :param list c: _description_, defaults to [1,2]
    :raises AssertionError: _description_
    :return _type_: _description_
    """
    if a > 10:
        raise AssertionError("a is more than 10")

    return c
```
