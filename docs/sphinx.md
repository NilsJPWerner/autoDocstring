# Sphinx Docstring Format

```python
def abc(a: int, c = [1,2]):
    """_summary_

    :param a: _description_
    :type a: int
    :param c: _description_, defaults to [1,2]
    :type c: list, optional
    :raises AssertionError: _description_
    :return: _description_
    :rtype: _type_
    """
    if a > 10:
        raise AssertionError("a is more than 10")

    return c
```
