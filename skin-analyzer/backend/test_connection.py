# test_connection.py
import requests

url = "https://yce-api-01.perfectcorp.com/s2s/v1.1/file/skin-analysis"
print(f"Attempting to connect to: {url}")

try:
    response = requests.get(url, timeout=15)
    print("\nSUCCESS! Connection established.")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

except requests.exceptions.SSLError as e:
    print("\nFAILED: An SSL Error occurred.")
    print("This is often caused by a corporate proxy or firewall.")
    print(f"Details: {e}")

except requests.exceptions.ConnectionError as e:
    print("\nFAILED: A Connection Error occurred.")
    print("This is likely a firewall or network issue. The server could not be reached.")
    print(f"Details: {e}")

except Exception as e:
    print(f"\nFAILED: An unexpected error occurred: {e}")