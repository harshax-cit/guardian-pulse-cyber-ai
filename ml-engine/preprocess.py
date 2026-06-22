import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib

categorical_cols = [
    'proto',
    'service',
    'state'
]

def fit_encoders(df):

    encoders = {}

    for col in categorical_cols:

        le = LabelEncoder()

        df[col] = le.fit_transform(
            df[col].astype(str)
        )

        encoders[col] = le

    joblib.dump(
        encoders,
        "models/feature_encoders.pkl"
    )

    return df


def transform_data(df):

    encoders = joblib.load(
        "models/feature_encoders.pkl"
    )

    for col in categorical_cols:

        le = encoders[col]

        mapping = {
            cls: idx
            for idx, cls in enumerate(le.classes_)
        }

        df[col] = (
            df[col]
            .astype(str)
            .map(mapping)
            .fillna(0)
            .astype(int)
        )

    return df