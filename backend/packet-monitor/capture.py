from scapy.all import sniff

def packet_callback(packet):
    print(packet.summary())

print("GuardianPulse Packet Monitor Started...")

sniff(
    prn=packet_callback,
    store=False
)