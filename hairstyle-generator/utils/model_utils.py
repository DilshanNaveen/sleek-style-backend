import gdown
import os

weight_dic = {'afhqwild.pt': 'https://drive.google.com/file/d/14OnzO4QWaAytKXVqcfWo_o2MzoR4ygnr/view?usp=sharing',
                'afhqdog.pt': 'https://drive.google.com/file/d/16v6jPtKVlvq8rg2Sdi3-R9qZEVDgvvEA/view?usp=sharing',
                'afhqcat.pt': 'https://drive.google.com/file/d/1HXLER5R3EMI8DSYDBZafoqpX4EtyOf2R/view?usp=sharing',
                'ffhq.pt': 'https://drive.google.com/file/d/1CLDwW-h0L-ZZxI8cE-RSA9QTSgG589d2/view',
                'metfaces.pt': 'https://drive.google.com/file/d/15BpwtaLMID2zXNcqbxoR_ZKR-OasipRS/view',
                'seg.pth': 'https://drive.google.com/file/d/1CO1GXrdGiY3en3hWG4nK-M-r4OMl2KqO/view'

}


def download_weight(weight_path):
    gdown.download(weight_dic[os.path.basename(weight_path)],
                   output=weight_path, fuzzy=True)
