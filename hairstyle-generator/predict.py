# Prediction interface for Cog ⚙️
# https://github.com/replicate/cog/blob/main/docs/python.md

from cog import BasePredictor, Input, Path

import argparse
import torch
import torchvision
import numpy as np
import sys
import os
import dlib

from utils.shape_predictor import align_face
from PIL import Image
from models.Embedding import Embedding
from models.Alignment import Alignment
from models.Blending import Blending

class Predictor(BasePredictor):
    def setup(self):
        """Load the model into memory to make running multiple predictions efficient"""

        # Set up the arguments manually
        self.args = argparse.Namespace(
            input_dir='input',
            sample_sets='sample-sets',
            output_dir='output',
            sign='realistic',
            smooth=5,
            size=1024,
            ckpt="trained_models/ffhq.pt",
            channel_multiplier=2,
            latent=512,
            n_mlp=8,
            device='cuda',
            seed=None,
            tile_latent=False,
            opt_name='adam',
            learning_rate=0.01,
            lr_schedule='fixed',
            save_intermediate=False,
            save_interval=300,
            verbose=False,
            seg_ckpt='trained_models/seg.pth',
            percept_lambda=1.0,
            l2_lambda=1.0,
            p_norm_lambda=0.001,
            l_F_lambda=0.1,
            W_steps=1100,
            FS_steps=250,
            ce_lambda=1.0,
            style_lambda=4e4,
            align_steps1=140,
            align_steps2=100,
            face_lambda=1.0,
            hair_lambda=1.0,
            blend_steps=400,
        )

        # self.face_aligner = FaceAligner(Path("shape_predictor_68_face_landmarks.dat"))
        self.predictor = dlib.shape_predictor("trained_models/shape_predictor_68_face_landmarks.dat")
        self.ii2s = Embedding(self.args)
        self.align = Alignment(self.args)
        self.blend = Blending(self.args)

    def predict(
        self,
        identity_image: Path = Input(description="Identity image"),
        appearance_image: Path = Input(description="Appearance image"),
    ) -> Path:
        """Run a single prediction on the model"""
        
        def align_face_func(image_path, predictor):
            faces = align_face(str(image_path), predictor)
            results = []
            for i, face in enumerate(faces):
                factor = 1024 // 1024
                assert 1024 * factor == 1024
                face_tensor = torchvision.transforms.ToTensor()(face).unsqueeze(0).cuda()
                face_tensor_lr = face_tensor[0].cpu().detach().clamp(0, 1)
                face = torchvision.transforms.ToPILImage()(face_tensor_lr)
                if factor != 1:
                    face = face.resize((1024, 1024), PIL.Image.LANCZOS)
                image_path_file = Path(image_path)
                if len(faces) > 1:
                    face.save(image_path_file.stem + f"_{i}.png")
                    results.append(image_path_file.stem + f"_{i}.png")
                else:
                    face.save(image_path_file.stem + f".png")
                    results = image_path_file.stem + f".png"
            return results
        
        aligned_identity_image = align_face_func(identity_image, self.predictor)
        aligned_appearance_image = align_face_func(appearance_image, self.predictor)
        
        print("aligned_identity_image :", aligned_identity_image)
        print("aligned_appearance_image :", aligned_appearance_image)

        # Use self.args instead of args
        im_path1 = Path(aligned_identity_image)
        im_path2 = Path(aligned_appearance_image)
        im_path3 = Path(aligned_appearance_image)

        im_set = {im_path1, im_path2, im_path3}
        self.ii2s.invert_images_in_W([*im_set])
        self.ii2s.invert_images_in_FS([*im_set])
        
        self.align.align_images(im_path1, im_path2, sign=self.args.sign, align_more_region=False, smooth=self.args.smooth)
        if im_path2 != im_path3:
            self.align.align_images(im_path1, im_path3, sign=self.args.sign, align_more_region=False, smooth=self.args.smooth, save_intermediate=False)

        result_path = self.blend.blend_images(im_path1, im_path2, im_path3, sign=self.args.sign)
        result_path = Path(str(result_path))
        
        print("result_path: ", result_path)
        
        return result_path
