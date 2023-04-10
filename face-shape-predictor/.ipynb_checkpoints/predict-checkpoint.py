# -*- coding: utf-8 -*-
# Prediction interface for Cog ⚙️
# https://github.com/replicate/cog/blob/main/docs/python.md

import os
import pickle
import pandas as pd
from shutil import copyfile
from cog import BasePredictor, Input, Path
from sklearn.preprocessing import StandardScaler
from functions_only_save import make_face_df_save

class Predictor(BasePredictor):
    def setup(self):
        """Load the model into memory to make running multiple predictions efficient"""
        with open("./female.pkl", "rb") as f:
            self.female_model = pickle.load(f)

        self.df = pd.DataFrame(
            columns=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',
             '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36',
             '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54',
             '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72',
             '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
             '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106',
             '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121',
             '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136',
             '137', '138', '139', '140', '141', '142', '143', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9',
             'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'Width', 'Height', 'H_W_Ratio', 'Jaw_width', 'J_F_Ratio',
             'MJ_width', 'MJ_J_width'])

    def predict(
        self,
        image: Path = Input(description="User's image"),
        gender: str = Input(
            description="Gender of the person in the image (male or female)", choices=["male", "female"], default="female"
        ),
    ) -> str:
        """Run a single prediction on the model"""
        data = pd.read_csv("female_all_features.csv", index_col=None)
        data = data.drop('Unnamed: 0', axis=1)  # drop
        data_clean = data.dropna(axis=0, how='any')
        X = data_clean
        X = X.drop(['filenum', 'filename', 'classified_shape'], axis=1)
        scaler = StandardScaler()
        scaler.fit(X)
        
        file_num = 2035
        
        file_path = image

        print("Columns in self.df:", self.df.columns)
        make_face_df_save(file_path, file_num, self.df)
    
        test_row = self.df.loc[file_num].values.reshape(1, -1)
        test_row = scaler.transform(test_row)
        face_shape = self.female_model.predict(test_row)
        
        return face_shape[0]
