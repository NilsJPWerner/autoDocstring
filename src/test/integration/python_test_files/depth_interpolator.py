from typing import Union, Tuple

import cv2
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import griddata


class DepthInterpolator:

    def run(self, fg_rgb_image: np.ndarray, fg_depth_image: np.ndarray,
            bg_rgb_image: np.ndarray, bg_depth_image: np.ndarray,
            debug: bool):

        pass

    def __repr__(self):

        return self.__class__.__name__


class DefaultInterpolator(DepthInterpolator):

    def run(self, fg_rgb_image: np.ndarray, fg_depth_image: np.ndarray,
            bg_rgb_image: np.ndarray, bg_depth_image: np.ndarray,
            debug: bool = False) -> np.ndarray:

        return np.asarray(fg_depth_image).copy()


class SciPyInterpolator(DepthInterpolator):

    def __init__(self, depth_threshold: int, rgb_threshold: int):

        self.depth_threshold = depth_threshold
        self.rgb_threshold = rgb_threshold

    def _subtract_depth_background(
            self, fg_depth_image: np.ndarray) -> np.ndarray:

        fg_depth_image = np.asarray(fg_depth_image).copy()
        mask = fg_depth_image >= self.depth_threshold
        fg_depth_image[mask] = self.depth_threshold

        return fg_depth_image

    def _subtract_rgb_background(self, fg_image: np.ndarray,
                                 bg_image: np.ndarray) -> np.ndarray:

        fg_image = np.asarray(fg_image).copy()
        bg_image = np.asarray(bg_image).copy()

        diff = bg_image.astype(np.float64) - fg_image.astype(np.float64)
        diff = np.abs(diff)
        diff = np.sum(diff, axis=2)

        mask = (diff >= self.rgb_threshold)

        return mask


class GridDataInterpolator(SciPyInterpolator):

    def __init__(self, method: str = 'linear', depth_threshold: int = 1000,
                 rgb_threshold: int = 175, rgb_bg_sub: bool = False):

        super().__init__(depth_threshold, rgb_threshold)

        self.method = method
        self.rgb_bg_sub = rgb_bg_sub

    def run(self, fg_rgb_image: np.ndarray, fg_depth_image: np.ndarray,
            bg_rgb_image: np.ndarray, bg_depth_image: np.ndarray,
            debug: bool = False) -> np.ndarray:

        fg_depth_image = self._subtract_depth_background(fg_depth_image)
        points, values = _prepare_data(fg_depth_image)
        if self.rgb_bg_sub:
            mask = self._subtract_rgb_background(fg_rgb_image, bg_rgb_image)
            fg_depth_image[~mask] = self.depth_threshold
        hole_rows, hole_cols = np.where(fg_depth_image == 0)

        h, w = fg_depth_image.shape
        grid_x, grid_y = np.mgrid[0:h:1, 0:w:1]
        grid_z = griddata(points, values, (grid_x, grid_y), method=self.method)

        for row, col in zip(hole_rows, hole_cols):
            if not np.isnan(grid_z[row, col]):
                fg_depth_image[row, col] = grid_z[row, col]

        if debug:

            _plot(grid_z)
            _plot(fg_depth_image)

        return fg_depth_image

    def __repr__(self):

        return '{}: {}'.format(self.__class__.__name__, self.method)


class MeanGridDataInterpolator(SciPyInterpolator):

    def __init__(self, methods, weights, depth_threshold: int = 1000,
                 rgb_threshold: int = 175, rgb_bg_sub: bool = True):

        super().__init__(depth_threshold, rgb_threshold)

        self.methods = methods
        self.weights = weights
        self.rgb_bg_sub = rgb_bg_sub
        self.interpolators = [
            GridDataInterpolator(
                method, depth_threshold, rgb_threshold, rgb_bg_sub)
            for method in self.methods
            ]

    def run(self, fg_rgb_image: np.ndarray, fg_depth_image: np.ndarray,
            bg_rgb_image: np.ndarray, bg_depth_image: np.ndarray,
            debug: bool = False) -> np.ndarray:

        depth_images = [
            interpolator.run(fg_rgb_image, fg_depth_image,
                             bg_rgb_image, bg_depth_image, debug)
            for interpolator
            in self.interpolators
            ]

        mean_depth_image = np.average(depth_images,
                                      axis=0,
                                      weights=self.weights)

        if debug:

            _plot(mean_depth_image)


        return mean_depth_image.astype(np.uint16)

    def __repr__(self):

        return '{}: {}'.format(self.__class__.__name__, self.methods)


class ForegroundInterpolator(DepthInterpolator):

    def __init__(self, depth_threshold: int, rgb_threshold: int, dilate_1: int,
                 dilate_2: int, dilate_3: int, erode: int, min_area: int):

        self.depth_threshold = depth_threshold
        self.rgb_threshold = rgb_threshold
        self.dilate_1 = dilate_1
        self.dilate_2 = dilate_2
        self.dilate_3 = dilate_3
        self.erode = erode
        self.min_area = min_area

    def run(self, fg_rgb_image: np.ndarray, fg_depth_image: np.ndarray,
            bg_rgb_image: np.ndarray, bg_depth_image: np.ndarray,
            debug: bool = False) -> np.ndarray:

        fg_rgb_image = np.asarray(fg_rgb_image).copy()
        fg_depth_image = np.asarray(fg_depth_image).copy()
        bg_rgb_image = np.asarray(bg_rgb_image).copy()
        bg_depth_image = np.asarray(bg_depth_image).copy()

        fg_threshold_mask = fg_depth_image >= self.depth_threshold
        fg_depth_image[fg_threshold_mask] = self.depth_threshold
        fg_rgb_image[fg_threshold_mask] = 0

        bg_threshold_mask = bg_depth_image >= self.depth_threshold
        bg_depth_image[bg_threshold_mask] = self.depth_threshold
        bg_rgb_image[bg_threshold_mask] = 0

        _, bg_sub_mask = self._subtract_background(
            fg_rgb_image, bg_rgb_image)

        bg_sub_rgb_mask = bg_sub_mask.astype(np.uint8)
        ded_rgb_mask = self._dilate_erode_dilate(bg_sub_rgb_mask)
        contours_rgb_mask = self._select_contours(ded_rgb_mask)
        contours_rgb_mask = contours_rgb_mask.astype(bool)

        contours_fg_depth_image = fg_depth_image.copy()
        contours_fg_depth_image[~contours_rgb_mask] = 0

        kernel = np.ones((self.dilate_3, self.dilate_3))
        dilate_depth_mask = cv2.dilate(
            contours_fg_depth_image, kernel, iterations=1)
        hole_mask = contours_fg_depth_image.copy().astype(bool)
        hole_fill_mask = (contours_rgb_mask) & (~hole_mask)

        hole_fill_depth_image = contours_fg_depth_image.copy()
        hole_fill_depth_image[hole_fill_mask] = \
            dilate_depth_mask[hole_fill_mask]

        fg_depth_image[contours_rgb_mask] = \
            hole_fill_depth_image[contours_rgb_mask]

        if debug:

            _plot(fg_depth_image)

        return fg_depth_image

    def _subtract_background(
            self, fg_image: np.ndarray,
            bg_image: np.ndarray) -> Tuple[np.ndarray]:

        diff = bg_image.astype(np.float64) - fg_image.astype(np.float64)
        diff = np.abs(diff)
        diff = np.sum(diff, axis=2)

        #diff = np.sqrt(np.sum((fg.astype(np.float64) - bg.astype(np.float64))**2, axis=2))

        mask = (diff >= self.rgb_threshold)

        bg_sub_fg_image = fg_image.copy()
        bg_sub_fg_image[~mask] = 255

        return bg_sub_fg_image, mask

    def _dilate_erode_dilate(self, mask: np.ndarray) -> np.ndarray:

        kernel_dilate_1 = np.ones((self.dilate_1, self.dilate_1))
        kernel_erode = np.ones((self.erode, self.erode))
        kernel_dilate_2 = np.ones((self.dilate_2, self.dilate_2))

        mask_dilate_1 = cv2.dilate(mask, kernel_dilate_1, iterations=1)
        mask_erode = cv2.erode(mask_dilate_1, kernel_erode, iterations=1)
        mask_dilate_2 = cv2.dilate(mask_erode, kernel_dilate_2, iterations=1)

        return mask_dilate_2

    def _select_contours(self, mask: np.ndarray) -> np.ndarray:

        mask_contoured = mask.copy()
        contours, _ = cv2.findContours(mask.copy(),
                                       cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_NONE)

        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if cv2.contourArea(contour) < self.min_area:
                mask_contoured[y:y+h+5, x:x+w+5] = 0

        return mask_contoured


def initialize_depth_interpolator(
        method: str, settings: dict) -> Union[GridDataInterpolator,
                                              ForegroundInterpolator,
                                              MeanGridDataInterpolator,
                                              DefaultInterpolator]:

    if method == 'grid':
        return GridDataInterpolator(settings['method'],
                                    settings['depth_threshold'],
                                    settings['rgb_threshold'],
                                    settings['rgb_bg_sub'])


    elif method == 'foreground':
        return ForegroundInterpolator(settings['depth_threshold'],
                                      settings['rgb_threshold'],
                                      settings['dilate_1'],
                                      settings['dilate_2'],
                                      settings['dilate_3'],
                                      settings['erode'],
                                      settings['min_area'])

    elif method == 'mean_grid':
        return MeanGridDataInterpolator(settings['methods'],
                                        settings['weights'],
                                        settings['depth_threshold'],
                                        settings['rgb_threshold'],
                                        settings['rgb_bg_sub'])

    else:
        return DefaultInterpolator()


def _plot(image):

    plt.figure(figsize=(8, 8))
    plt.imshow(image)
    plt.show()


def _prepare_data(fg_depth_image: np.ndarray) -> Tuple[np.ndarray]:

    points = []
    values = []
    nonzero_rows, nonzero_cols = np.where(fg_depth_image != 0)

    for i, j in zip(nonzero_rows, nonzero_cols):
        points.append((i, j))
        values.append(fg_depth_image[i, j])

    return np.array(points), np.array(values)
