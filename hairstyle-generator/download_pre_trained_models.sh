rm -rf trained_models
mkdir trained_models
cd trained_models
gdown 1CMapMlu2Y6zVF_TREUEf3Llv59RmQXgN # shape_predictor_68_face_landmarks.dat
gdown 1CLDwW-h0L-ZZxI8cE-RSA9QTSgG589d2 # ffhq.pt
gdown 15OH808sHDL0vawDk4tvTgcvB5dSH7HI9 # ffhq_PCA.npz
# gdown 15BpwtaLMID2zXNcqbxoR_ZKR-OasipRS # metfaces_PCA.npz

cd ../ && cog predict -i identity_image=@identity_image.png -i appearance_image=@appearance_image.png