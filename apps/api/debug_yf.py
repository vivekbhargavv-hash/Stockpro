"""Quick yfinance download diagnostic."""
import yfinance as yf
import pandas as pd

print("=== Single ticker ===")
df1 = yf.download("RELIANCE.NS", period="30d", auto_adjust=True, progress=False)
print(f"Empty: {df1.empty}  Rows: {len(df1)}")
if not df1.empty:
    print(df1.tail(2))

print("\n=== Two tickers ===")
df2 = yf.download("RELIANCE.NS TCS.NS", period="30d", auto_adjust=True, progress=False)
print(f"Empty: {df2.empty}  Shape: {df2.shape}")
print(f"MultiIndex: {isinstance(df2.columns, pd.MultiIndex)}")
if isinstance(df2.columns, pd.MultiIndex):
    print(f"Level 0 unique: {df2.columns.get_level_values(0).unique().tolist()}")
    print(f"Level 1 unique: {df2.columns.get_level_values(1).unique().tolist()}")
    try:
        sub = df2.xs("RELIANCE.NS", axis=1, level=1)
        print(f"xs(level=1) RELIANCE rows: {len(sub)}")
    except Exception as e:
        print(f"xs level=1 failed: {e}")
    try:
        sub = df2["RELIANCE.NS"]
        print(f"raw['RELIANCE.NS'] rows: {len(sub)}")
    except Exception as e:
        print(f"raw['RELIANCE.NS'] failed: {e}")
