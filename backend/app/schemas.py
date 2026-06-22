from pydantic import BaseModel

class ThreatRequest(BaseModel):

    dur: float

    proto: str
    service: str
    state: str

    spkts: int
    dpkts: int

    sbytes: int
    dbytes: int

    rate: float

    sload: float
    dload: float

    sloss: int
    dloss: int

    sinpkt: float
    dinpkt: float

    sjit: float
    djit: float

    swin: int
    stcpb: int
    dtcpb: int
    dwin: int

    tcprtt: float
    synack: float
    ackdat: float

    smean: float
    dmean: float

    trans_depth: int
    response_body_len: int

    ct_src_dport_ltm: int
    ct_dst_sport_ltm: int

    is_ftp_login: int
    ct_ftp_cmd: int
    ct_flw_http_mthd: int

    is_sm_ips_ports: int