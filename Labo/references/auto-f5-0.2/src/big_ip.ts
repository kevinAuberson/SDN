import { bigip_hostname } from "./config.ts";
import { get as getCredentials } from "./credentials.ts";
import { encode, request } from "./deps.ts";

const { username, password } = await getCredentials();

const headers = {
  "Content-Type": "application/json",
  Authorization: `Basic ${encode(`${username}:${password}`)}`,
};

const makeUri = (path: string) =>
  `https://${bigip_hostname}/mgmt/tm/ltm/${path}`;

type RequestOptions = Parameters<typeof request>[1];

const makeOptions = (body: Record<string, unknown>): RequestOptions => ({
  headers,
  method: "POST",
  body: JSON.stringify(body),
});

type NodeWithIP = { name: string; address: string; port: number };
type NodeWithFQDN = { name: string; fqdn: string; port: number };

type Node = NodeWithIP | NodeWithFQDN;

type Pool = {
  name: string;
  members: Node[];
};

const toMember = (node: Node) => {
  if ("address" in node) {
    const { name, port, address } = node;
    return {
      name: `${name}:${port}`,
      address,
    };
  } else {
    const { name, port, fqdn } = node;
    return {
      name: `${name}:${port}`,
      fqdn: {
        name: fqdn,
      },
    };
  }
};

export const createPool = async ({ name, members }: Pool) => {
  const payload = {
    name,
    members: members.map(toMember),
    monitor: "https",
  };
  {
    const { statusCode, body } = await request(
      makeUri("pool"),
      makeOptions(payload)
    );
    console.log(statusCode, await body.json());
  }
};

type SnatPool = {
  name: string;
  members: string[];
};

export const createSnatPool = async ({ name, members }: SnatPool) => {
  const payload = {
    name,
    members,
  };
  {
    const { statusCode, body } = await request(
      makeUri("snatpool"),
      makeOptions(payload)
    );
    console.log(statusCode, await body.json());
  }
};

type VirtualServer = {
  name: string;
  ip: string;
  port: number;
  poolName: string;
  snatPoolName: string;
};

export const createVirtualServer = async ({
  name,
  ip,
  port,
  poolName,
  snatPoolName,
}: VirtualServer) => {
  const payload = {
    name,
    destination: `${ip}:${port}`,
    pool: poolName,
    sourceAddressTranslation: {
      pool: snatPoolName,
      type: "snat",
    },
    profiles: [
      { name: "/Common/PRO-SSL-CLI-WILDCARD", context: "clientside" },
      { name: "/Common/serverssl", context: "serverside" },
      { name: "/Common/http", context: "all" },
      { name: "/Common/http2", context: "clientside" },
      { name: "/Common/tcp-wan-optimized", context: "all" },
      { name: "/Common/wan-optimized-compression", context: "all" },
    ],
  };
  {
    const { statusCode, body } = await request(
      makeUri("virtual"),
      makeOptions(payload)
    );
    console.log(statusCode, await body.json());
  }
};
