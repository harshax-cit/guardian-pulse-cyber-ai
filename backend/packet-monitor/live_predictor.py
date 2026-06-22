from scapy.all import sniff
import requests

from flow_builder import add_packet, get_completed_flows
from feature_extractor import extract_features

API_URL = "http://127.0.0.1:8000/predict"

EVENT_COUNTER = 0


def packet_callback(packet):

    global EVENT_COUNTER

    add_packet(packet)

    completed_flows = get_completed_flows()

    for flow_key, packets in completed_flows:

        try:

            payload = extract_features(
                flow_key,
                packets
            )

            print("\nFLOW INFO")
            print(f"Source IP   : {flow_key[0]}")
            print(f"Destination : {flow_key[1]}")
            print(f"Source Port : {flow_key[2]}")
            print(f"Dest Port   : {flow_key[3]}")
            print(f"Protocol    : {flow_key[4]}")
            print(f"Service     : {payload['service']}")

            response = requests.post(
                API_URL,
                json=payload,
                timeout=5
            )

            if response.status_code != 200:

                print("\nAPI ERROR")
                print("Status:", response.status_code)
                print("Response:", response.text)
                continue

            result = response.json()

            attack = result.get(
                "attack_type",
                "Unknown"
            )

            confidence = result.get(
                "confidence",
                0
            )

            severity = result.get(
                "severity",
                "Unknown"
            )

            risk_score = result.get(
                "risk_score",
                0
            )

            EVENT_COUNTER += 1

            if severity == "Critical":
                icon = "🚨"
            elif severity == "High":
                icon = "🟠"
            elif severity == "Medium":
                icon = "🟡"
            else:
                icon = "🟢"

            print("\n" + "=" * 60)
            print(f"{icon} EVENT #{EVENT_COUNTER}")
            print("=" * 60)
            print(f"Attack Type : {attack}")
            print(f"Confidence  : {confidence}%")
            print(f"Severity    : {severity}")
            print(f"Risk Score  : {risk_score}")
            print("=" * 60)

        except Exception as e:

            print("\nPREDICTION ERROR")
            print(str(e))


print("\nGuardianPulse Cyber AI")
print("Live Flow Detection Started...")
print("-" * 60)

sniff(
    prn=packet_callback,
    store=False
)