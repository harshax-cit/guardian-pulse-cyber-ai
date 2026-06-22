import pandas as pd

train = pd.read_parquet("data/UNSW_NB15_training-set.parquet")

print("=" * 50)
print("DATASET SHAPE")
print("=" * 50)
print(train.shape)

print("\n" + "=" * 50)
print("COLUMNS")
print("=" * 50)
print(train.columns.tolist())

print("\n" + "=" * 50)
print("FIRST 5 ROWS")
print("=" * 50)
print(train.head())

print("\n" + "=" * 50)
print("TARGET DISTRIBUTION")
print("=" * 50)

if "attack_cat" in train.columns:
    print(train["attack_cat"].value_counts())
else:
    print("attack_cat column not found")