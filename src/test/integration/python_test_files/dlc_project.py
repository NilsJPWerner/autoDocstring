"""TODO
"""
import os
os.environ['DLCLight'] = 'True'
import glob
import datetime

from deeplabcut import create_new_project as dlc_create_new_project

from .deeplabcut_utils import load_yaml, dump_yaml


class DLCProject:
    """Class to represent DeepLabCut project. Allows access to
    config.yaml and all subdirectories in a DLC Project.
    Parameters
    ----------
    project_path : str
        Full path to specific project directory.
    config_init_path : str
        Full path to yaml file that is used to specify any default
        configuration settings that are to be overwritten along with
        their values.
    Attributes
    ----------
    project_path : str
        Full path to specific project directory.
    config_path : str
        Full path to specific project config.yaml file.
    labeled_data_path : str
        Full path to project labeled-data directory.
    config_yaml : yaml
        yaml object containing the project's configuration info.
    """

    def __init__(self, project_path: str, config_init_path: str = ''):

        self.project_path = project_path
        self.config_path = os.path.join(project_path, 'config.yaml')
        self.labeled_data_path = os.path.join(project_path, 'labeled-data')
        if config_init_path:
            self.config_yaml = self._initialize_config_yaml(config_init_path)
        else:
            self.config_yaml = load_yaml(self.config_path)

    @classmethod
    def create_new_project(
            cls, scorer: str, videos: list, task: str = 'TopDownPerson',
            config_init_path: str = (
                '/home/shared/Projects/train-person-detector/configs/'
                'changes_to_config.yaml'),
            working_directory: str = (
                '/home/shared/Projects/train-person-detector/dlc-projects')):
        """Creates a new DeepLabCut project and DLCProject instance.
        Parameters
        ----------
        scorer : str
            Name of scorer or experimenter. For Innovation Lab, this is
            generally the name of the dataset e.g. data1-trace.
        video_root : str
            Path of the video files to be used just
            before the camera name e.g.
            /home/shared/mr_merchant_topdown/processed/20200302/data1-trace
        task : str, default='TopDownPerson'
            Name of task being performed in project.
        config_init_path : str, default='changes_to_config.yaml'
            YAML file containing all changes needing to be made to default
            config.yaml created with new projects.
        working_directory : str, default='/home/shared/Projects/train-person-detector/dlc-projects'
            Root directory of 'dlc-projects' (differs between Linux and
            Mac)
        Returns
        -------
        project : DLCProject
            The DLCProject created from the given arguments.
        """
        date = datetime.date.today().strftime('%Y-%m-%d')
        project_name = f'{task}-{scorer}-{date}'
        project_path = os.path.join(working_directory, project_name)
        # videos = glob.glob(f'{video_root}*mp4')

        dlc_create_new_project(task, scorer, videos, copy_videos=False,
                               working_directory=working_directory)
        project = DLCProject(project_path, config_init_path)

        return project

    @property
    def scorer(self):
        """Returns scorer from config_yaml"""
        return self.config_yaml['scorer']

    def _initialize_config_yaml(self, config_init_path):
        """Updates the default config.yaml file with new values
        specified in the yaml file located at config_init_path"""
        config_yaml = load_yaml(self.config_path)
        config_initialization_yaml = load_yaml(config_init_path)

        for key in config_initialization_yaml.keys():
            config_yaml[key] = config_initialization_yaml[key]

        dump_yaml(self.config_path, config_yaml)

        return config_yaml

    def _update_config_yaml(self, key, item):
        """Updates the config.yaml at the given key with the given item.
        """
        self.config_yaml[key] = item
        dump_yaml(self.config_path, self.config_yaml)

    def _update_snapshotindex(self, snapshotindex):
        """Sets the snapshotindex in the config.yaml file to a specified
        value."""
        self._update_config_yaml('snapshotindex', snapshotindex)

    def _filepath_builder(self, subdir, filename):
        """Builds filepaths to given filenames located in the project's
        subdirectories."""
        iteration = self.config_yaml['iteration']
        task = self.config_yaml['Task']
        date = self.config_yaml['date']
        iteration_dir = f'iteration-{iteration}'

        if subdir in ['dlc-models', 'evaluation-results']:
            training_fraction = self.config_yaml['TrainingFraction'][0]
            training_fraction = str(training_fraction)[2:]
            train_shuffle_dir = f'{task}{date}-trainset{training_fraction}shuffle1'
        elif subdir == 'training-datasets':
            train_shuffle_dir = f'UnaugmentedDataSet_{task}{date}'

        filepath = os.path.join(self.project_path, subdir, iteration_dir,
                                train_shuffle_dir, filename)

        return filepath

    def _update_pose_config_yaml(self, split, key, item):
        """Updates the pose_config.yaml file used during training at
        the given key with the given item."""
        filename = f'{split}/pose_config.yaml'
        pose_config_path = self._filepath_builder('dlc-models', filename)
        pose_config_yaml = load_yaml(pose_config_path)
        pose_config_yaml[key] = item
        dump_yaml(pose_config_path, pose_config_yaml)

    def update_pose_config_init_weights(self, init_weights):
        """Updates the pose_config.yaml init_weights item in order to
        carry out transfer learning or continue training from a
        checkpoint."""
        self._update_pose_config_yaml('train', 'init_weights', init_weights)
        self._update_pose_config_yaml('test', 'init_weights', init_weights)

    def __repr__(self):

        return self.config_path

    def get_labeled_data_by_camera(self, camera):
        """Gets the labeled-data directory for a given camera/video."""
        return glob.glob(f'{self.labeled_data_path}/*{camera}')[0]

    def get_labeled_data_by_string(self, string):
        """Gets the labeled-data directory for a given camera/video."""
        # print(string)
        # print(glob.glob(f'{self.labeled_data_path}/{string}*'))
        # print(os.path.join(self.labeled_data, string))
        #print(f'{self.labeled_data_path}/{string}*')
        return glob.glob(f'{self.labeled_data_path}/{string}*')[0]

    def get_csv_by_string(self, string):
        #print(f'{self.labeled_data_path}/{string}*/*csv')
        return glob.glob(f'{self.labeled_data_path}/{string}*/*csv')[0]

    def get_labeled_data_dirs(self):
        """Gets the labeled-data directory for all cameras."""
        return glob.glob(os.path.join(self.labeled_data_path, '*/'))

    def get_videos(self):
        """Gets list of all videos used in project."""
        return os.listdir(self.labeled_data_path)

    def get_csv_filepath_by_video(self, video):
        """Gets the CSV filepath for the given video."""
        csv_filename = f'*{self.scorer}*csv'
        csv_glob = os.path.join(self.labeled_data_path, video, csv_filename)
        return glob.glob(csv_glob)[0]


if __name__ == '__main__':

    # projects_root = '/home/shared/Projects'
    # repo_name = 'train-person-detector'
    SCORER = 'data1-trace-masked'
    DATA_ROOT = '/home/shared/mr_merchant_topdown/processed'
    DATASET_DATE = '20200302'
    DATASET_DIR = os.path.join(DATA_ROOT, DATASET_DATE)
    DATASET_NAME = 'data1-trace-masked'
    VIDEO_ROOT = os.path.join(DATASET_DIR, DATASET_NAME)
    CONFIG_INIT_PATH = '/home/shared/Projects/train-person-detector/configs/changes_to_config.yaml'
    # project_root = '/home/shared/Projects/train-person-detector/projects'
    # project_name = 'TopDownPerson-data1-10ids-exp1-2020-03-25'
    # project = DLCProject(project_root, project_name)

    project = DLCProject.create_new_project(SCORER, VIDEO_ROOT,
                                            config_init_path=CONFIG_INIT_PATH)
    print(project)
    print(project.config_yaml['TrainingFraction'])