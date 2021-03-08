class TestClass(object):

    def __init__(self, arg1: int, arg2: str, arg3: float = None):
        self.arg1 = arg1
        self.arg2 = arg2
        self.arg3 = arg3
        self.arg4 = self._get_arg4()

    def _get_arg4(self):
        return 4
