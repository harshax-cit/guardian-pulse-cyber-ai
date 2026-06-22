import pandas as pd
import joblib
import warnings
import time

from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

start_time = time.time()

print("=" * 60)
print("GUARDIANPULSE CYBER AI TRAINING")
print("=" * 60)

print("\nLoading datasets...")

train_df = pd.read_parquet(
    "data/UNSW_NB15_training-set.parquet"
)

test_df = pd.read_parquet(
    "data/UNSW_NB15_testing-set.parquet"
)

print(f"Training Shape : {train_df.shape}")
print(f"Testing Shape  : {test_df.shape}")

categorical_cols = [
    "proto",
    "service",
    "state"
]

feature_encoders = {}

print("\nEncoding categorical columns...")

for col in categorical_cols:

    le = LabelEncoder()

    train_df[col] = le.fit_transform(
        train_df[col].astype(str)
    )

    mapping = {
        cls: idx
        for idx, cls in enumerate(le.classes_)
    }

    test_df[col] = (
        test_df[col]
        .astype(str)
        .map(mapping)
        .fillna(0)
        .astype(int)
    )

    feature_encoders[col] = le

joblib.dump(
    feature_encoders,
    "models/feature_encoders.pkl"
)

target_encoder = LabelEncoder()

y_train = target_encoder.fit_transform(
    train_df["attack_cat"]
)

y_test = target_encoder.transform(
    test_df["attack_cat"]
)

joblib.dump(
    target_encoder,
    "models/target_encoder.pkl"
)

print("\nAttack Classes:")

for idx, attack in enumerate(
    target_encoder.classes_
):
    print(f"{idx} -> {attack}")

X_train = train_df.drop(
    ["attack_cat", "label"],
    axis=1
)

X_test = test_df.drop(
    ["attack_cat", "label"],
    axis=1
)

print("\nCreating Engineered Features...")

X_train["packet_ratio"] = (
    X_train["spkts"] /
    (X_train["dpkts"] + 1)
)

X_train["byte_ratio"] = (
    X_train["sbytes"] /
    (X_train["dbytes"] + 1)
)

X_train["load_ratio"] = (
    X_train["sload"] /
    (X_train["dload"] + 1)
)

X_test["packet_ratio"] = (
    X_test["spkts"] /
    (X_test["dpkts"] + 1)
)

X_test["byte_ratio"] = (
    X_test["sbytes"] /
    (X_test["dbytes"] + 1)
)

X_test["load_ratio"] = (
    X_test["sload"] /
    (X_test["dload"] + 1)
)

print("\nFeature Count:", X_train.shape[1])

print("\nTraining XGBoost...")

model = XGBClassifier(
    n_estimators=300,
    max_depth=10,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softprob",
    eval_metric="mlogloss",
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)

print("\nMaking predictions...")

predictions = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n" + "=" * 60)
print("MODEL RESULTS")
print("=" * 60)

print(f"\nAccuracy : {accuracy:.4f}")

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions,
        target_names=target_encoder.classes_
    )
)

joblib.dump(
    model,
    "models/cyber_threat_model.pkl"
)

print("\nModel Saved Successfully")

print("\nSaved Files:")
print("models/cyber_threat_model.pkl")
print("models/feature_encoders.pkl")
print("models/target_encoder.pkl")

end_time = time.time()

print(
    f"\nTraining Time: "
    f"{(end_time-start_time)/60:.2f} minutes"
)

print("\nTraining Completed Successfully")