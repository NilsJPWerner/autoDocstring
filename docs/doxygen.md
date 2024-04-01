# Doxygen Docstring Format

```python
def abc(a: int, c = [1,2]):
    """!
    @brief _summary_

    @param a (int): _description_
    @param c (list, optional): _description_. Defaults to [1,2].

    @return (_type_): _description_

    @exception AssertionError: _description_
    """
    if a > 10:
        raise AssertionError("a is more than 10")

    return c
```
