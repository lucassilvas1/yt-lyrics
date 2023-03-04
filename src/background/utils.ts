import { random, sleep } from "../common/misc";
import storage from "../common/storage";

export function getHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`,
    origin: "https://open.spotify.com",
    referer: "https://open.spotify.com/",
    "app-platform": "WebPlayer",
  };
}

export async function request(
  url: string,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    console.warn("Could not fetch:", url, init);
    await sleep(random(350, 900));
    return await request(url, init);
  }
}

async function getNewToken(remainingTries = 3): Promise<string> {
  if (!remainingTries)
    throw new Error("Could not retrieve new token after 3 attempts.");
  try {
    const tokenObj = await request(
      "https://open.spotify.com/get_access_token"
    ).then((res) => res.json());
    storage.tokenObj.set(tokenObj);
    return tokenObj.accessToken;
  } catch (error) {
    console.error(error);
    await sleep(500);
    return await getNewToken(remainingTries - 1);
  }
}

export async function getToken() {
  const tokenObj = await storage.tokenObj.get();
  return tokenObj.accessTokenExpirationTimestampMs > Date.now()
    ? tokenObj.accessToken
    : await getNewToken();
}
