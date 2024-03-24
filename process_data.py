import pandas as pd

# Assuming the data is comma-separated. Adjust 'sep' as needed for your data's format.
df = pd.read_csv('./ATL_stats.txt', sep=',')

# Convert 'Average Daily Flights' to integer
df['Average Daily Flights'] = pd.to_numeric(df['Average Daily Flights'], errors='coerce').fillna(0).astype(int)

# Fill missing values for numerical columns with 0 and string columns with 'Unknown'
numeric_cols = df.select_dtypes(include=['number']).columns
df[numeric_cols] = df[numeric_cols].fillna(0)

string_cols = df.select_dtypes(include=['object']).columns
df[string_cols] = df[string_cols].fillna('Unknown')

# Split 'Operators' into a list
df['Operators'] = df['Operators'].apply(lambda x: x.split(',') if x != 'Unknown' else [])

# Adding a column for the number of operators
df['Number of Operators'] = df['Operators'].apply(len)

# Aggregating data to see total flights per country
flights_per_country = df.groupby('Country')['Average Daily Flights'].sum().reset_index()

# Combine Latitude and Longitude into a single string
df['Lat-Long'] = df.apply(lambda row: f"{row['Latitude']},{row['Longitude']}", axis=1)

# Sort by 'Average Daily Flights'
sorted_df = df.sort_values('Average Daily Flights', ascending=False)

# Displaying the first few rows of the sorted DataFrame
print(sorted_df.head())

# Displaying the total flights per country
print(flights_per_country)
