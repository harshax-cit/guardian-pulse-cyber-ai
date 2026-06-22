from collections import defaultdict
import time

from scapy.layers.inet import IP, TCP, UDP

flows = defaultdict(list)


def get_flow_key(packet):

    if IP not in packet:
        return None

    src_ip = packet[IP].src
    dst_ip = packet[IP].dst

    proto = "other"
    src_port = 0
    dst_port = 0

    if TCP in packet:

        proto = "tcp"
        src_port = packet[TCP].sport
        dst_port = packet[TCP].dport

    elif UDP in packet:

        proto = "udp"
        src_port = packet[UDP].sport
        dst_port = packet[UDP].dport

    return (
        src_ip,
        dst_ip,
        src_port,
        dst_port,
        proto
    )


def add_packet(packet):

    key = get_flow_key(packet)

    if key:

        flows[key].append(
            {
                "time": time.time(),
                "size": len(packet)
            }
        )


def get_completed_flows():

    completed = []

    for key, packets in list(flows.items()):

        if len(packets) >= 10:

            completed.append(
                (key, packets)
            )

            del flows[key]

    return completed