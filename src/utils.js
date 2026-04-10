function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function capitalizeFirstLetter(str) {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const baseURL = process.env.API_ROUTE || "http://no_base_url.bebebebebe/";
async function myFetch(path, init) {
  const fullURL = new URL(baseURL + path).href;
  const res = await fetch(fullURL, {
    method: "GET",
    ...init,
    body: init?.body ? JSON.stringify(init.body) : undefined,
    headers: {
      Authorization: process.env.AUTH_TOKEN,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  
  const result = {
    ok: res.ok,
    status: res.status,
    res: res,
    errors: [],
  };

  try {
    if (res.body) {
      result.body = await res.json();
    }
  } catch (error) {
    console.log("попытка получить body потерпела крах");
  }

  return result;
}

export { getRandomArrayElement, capitalizeFirstLetter, myFetch };
