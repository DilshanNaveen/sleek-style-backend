import os
import json
import requests

import pickle
import pandas as pd
from sklearn.preprocessing import StandardScaler

import functions_only_save

FACE_SHAPE = ''
UPLOAD_FOLDER = './upload'

data = pd.read_csv('./all_features.csv', index_col=None)
data = data.drop('Unnamed: 0', axis=1)  # drop
data_clean = data.dropna(axis=0, how='any')
X = data_clean
X = X.drop(['filenum', 'filename', 'classified_shape'], axis=1)
scaler = StandardScaler()
scaler.fit(X)

def handler(event, context):
    f = open('face-shape-predictor.pkl', 'rb')  # 'r' for reading; can be omitted
    mod = pickle.load(f)
    
    df = pd.DataFrame(columns=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',
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


    # url = 'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg'
    # os.mkdir(UPLOAD_FOLDER)
    # path = os.path.join(UPLOAD_FOLDER, "'sample.jpg")
    path = "./sample.jpg"
    # r = requests.get(url, allow_redirects=True)
    # open(path, 'wb').write(r.content)

    file_num = 2035
    functions_only_save.make_face_df_save(path, file_num, df)
    
    # # Add a row of data to the dataframe
    # df.loc[0] = [0 for i in range(200)]

    dfc = df
    test_row = dfc.loc[file_num].values.reshape(1, -1)
    test_row = scaler.transform(test_row)
    face_shape = mod.predict(test_row)
    
    body = {
        "face_shape": face_shape[0],
        "input": event,
    }

    return {"statusCode": 200, "body": json.dumps(body)}
    
    # return { "statusCode": 200, "message": "face_shape[0]" }