import dlib
from pathlib import Path
import argparse
import torchvision
from utils.drive import open_url
from utils.shape_predictor import align_face
import PIL

class FaceAligner:
    def __init__(self, predictor_path: Path, output_size: int = 1024):
        """
        Initializes a FaceAligner object with the given shape predictor path and output size.

        Args:
            predictor_path (Path): Path to the shape predictor.
            output_size (int): Size to downscale the input images to, must be power of 2. Default is 1024.
        """
        self.predictor_path = predictor_path
        self.output_size = output_size

        # Load the predictor
        self.predictor = dlib.shape_predictor(str(predictor_path))

    def align_face(self, image_path: Path, output_dir: str) -> Path:
        """
        Given an input image, aligns the face in the image and returns the aligned image path and the number of faces detected.

        Args:
            image_path (Path): Path to the input image.

        Returns:
            Tuple[Path, int]: A tuple containing the path to the aligned image and the number of faces detected in the input image.
        """
        output_size = 1024
        factor = 1024//output_size
        assert output_size*factor == 1024
        face_tensor = torchvision.transforms.ToTensor()(face).unsqueeze(0).cuda()
        face_tensor_lr = face_tensor[0].cpu().detach().clamp(0, 1)
        face = torchvision.transforms.ToPILImage()(face_tensor_lr)
        if factor != 1:
            face = face.resize((output_size, output_size), PIL.Image.LANCZOS)
        face.save(Path(output_dir) / (im.stem + f".png"))
            
