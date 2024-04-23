import http from "k6/http";
import {
  randomString,
  randomIntBetween,
} from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
import { sleep, check } from "k6";

export const options = {
  vus: 20,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const BASE_URL = "http://localhost:8080";
  const headers = { "Content-Type": "application/json" };

  const payload = JSON.stringify({
    task: randomString(20),
    description: randomString(50),
  });

  const todos = http.get(
    `${BASE_URL}/api/v1/todos?limit=${randomIntBetween(-10, 1000)}`,
    { params: { headers } }
  );
  check(todos, { "status is 200": (r) => r.status === 200 });

  const res = http.post(`${BASE_URL}/api/v1/todos`, payload, { headers });
  check(res, { "status is 201": (r) => r.status === 201 });
  // sleep(1);
}
