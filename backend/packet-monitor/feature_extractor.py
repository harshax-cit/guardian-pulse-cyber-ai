import time


def extract_features(flow_key, packets):

    duration = max(
        packets[-1]["time"] - packets[0]["time"],
        0.001
    )

    packet_count = len(packets)

    total_bytes = sum(
        p["size"]
        for p in packets
    )

    avg_size = total_bytes / packet_count

    rate = packet_count / duration

    src_ip = flow_key[0]
    dst_ip = flow_key[1]
    src_port = flow_key[2]
    dst_port = flow_key[3]
    proto = flow_key[4]

    service_map = {

        80: "http",
        443: "https",

        53: "dns",

        22: "ssh",

        21: "ftp",

        25: "smtp",

        110: "pop3",

        143: "imap",

        3306: "mysql",

        5432: "postgresql",

        6379: "redis",

        27017: "mongodb",

        8080: "http-alt",

        8443: "https-alt",

        3389: "rdp",

        5900: "vnc",

        5353: "mdns"
    }

    service = "unknown"

    if dst_port in service_map:

        service = service_map[dst_port]

    elif src_port in service_map:

        service = service_map[src_port]

    if service == "unknown":

        print(
            f"Unknown Service Port: {src_port} -> {dst_port}"
        )

    return {

        "dur": float(duration),

        "proto": proto,
        "service": service,
        "state": "FIN",

        "spkts": int(packet_count),
        "dpkts": int(packet_count),

        "sbytes": int(total_bytes),
        "dbytes": int(total_bytes),

        "rate": float(rate),

        "sload": float(total_bytes),
        "dload": float(total_bytes),

        "sloss": 0,
        "dloss": 0,

        "sinpkt": float(
            duration / packet_count
        ),

        "dinpkt": float(
            duration / packet_count
        ),

        "sjit": 0.0,
        "djit": 0.0,

        "swin": 255,
        "stcpb": 1000,
        "dtcpb": 1000,
        "dwin": 255,

        "tcprtt": 0.01,
        "synack": 0.005,
        "ackdat": 0.005,

        "smean": float(avg_size),
        "dmean": float(avg_size),

        "trans_depth": 0,
        "response_body_len": 0,

        "ct_src_dport_ltm": 1,
        "ct_dst_sport_ltm": 1,

        "is_ftp_login": 0,
        "ct_ftp_cmd": 0,

        "ct_flw_http_mthd": (
            1 if service in [
                "http",
                "https",
                "http-alt",
                "https-alt"
            ] else 0
        ),

        "is_sm_ips_ports": (
            1 if src_ip == dst_ip
            else 0
        )
    }