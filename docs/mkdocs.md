# MkDocs Docstring Format

```python
def abc(a: int, c = [1,2]):
    """_summary_
    
    
    
    #### Args
    > ##### `a: int`
    > _description_
    
    > ##### `c: list = [1,2]`
    > _description_
    
    
    #### Raises
    > ##### `AssertionError`
    > _description_
    
    
    #### Returns
    > ##### `_type_`
    > _description_
    """
    if a > 10:
        raise AssertionError("a is more than 10")

    return c
```