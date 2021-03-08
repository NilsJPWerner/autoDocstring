class TestClass(object):
    """[summary]

    :param arg1: [description]
    :type arg1: int
    :param arg2: [description]
    :type arg2: str
    :param arg3: [description], defaults to None
    :type arg3: float, optional
    """
    def __init__(self, arg1: int, arg2: str, arg3: float = None):
        self.arg1 = arg1
        self.arg2 = arg2
        self.arg3 = arg3
        self.arg4 = self._get_arg4()

    def _get_arg4(self):
        return 4
