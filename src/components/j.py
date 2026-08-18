import json
from pathlib import Path


# Folder where j.py is located
folder = Path(__file__).resolve().parent

# Input and output files
input_file = folder / "bacData.json"
output_file = folder / "bacData_cleaned.json"


# Check that input exists
if not input_file.exists():
    print(f"ERROR: File not found: {input_file}")
    exit()


# Load JSON
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)


cleaned_data = []


# Process every record
for item in data:

    # Remove old Column1
    item.pop("Column1", None)

    # Get Airline
    airline = str(item.get("Airline", "")).strip()

    # Split multiple airlines
    airlines = airline.split("/")

    for airline_name in airlines:

        airline_name = airline_name.strip()

        # Ignore empty values
        if not airline_name:
            continue

        # Make a copy
        new_item = item.copy()

        # Set individual airline
        new_item["Airline"] = airline_name

        # Create new Column1
        new_item["Column1"] = (
            f'{new_item["BAC"]}-{new_item["Texture"]}-{airline_name}'
        )

        # Add to output
        cleaned_data.append(new_item)


# Save new JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(
        cleaned_data,
        f,
        indent=4,
        ensure_ascii=False
    )


print("========================================")
print("DONE!")
print("========================================")
print(f"Original records: {len(data)}")
print(f"New records:      {len(cleaned_data)}")
print(f"Output file:      {output_file}")