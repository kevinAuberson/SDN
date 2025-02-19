import { createPool, createSnatPool, createVirtualServer } from "./big_ip.ts";

// --- Create a pool, a SNAT pool and a virtual server ---

const pool = {
  name: "POO-TEST",
};

const node = {
  name: "MY-Server-1",
  fqdn: "myserver1.heig.xxx",
  port: 443,
};

const snatPool = {
  name: "SNAT-CMM-ARCHIOWEB",
  address: "192.168.1.1",
};

const vServer = {
  name: "VSR-WEB-TEST",
  ip: "10.1.1.1",
  port: 443,
};

// ---

await createPool({
  name: pool.name,
  members: [node],
});

console.log("Pool created");

await createSnatPool({
  name: snatPool.name,
  members: [snatPool.address],
});

console.log("SNAT pool created");

await createVirtualServer({
  ...vServer,
  poolName: pool.name,
  snatPoolName: snatPool.name,
});

console.log("Virtual server created");
