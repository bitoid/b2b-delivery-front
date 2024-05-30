export async function getCouriers(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/couriers/`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getClients(token: string | undefined) {
  try {
    const response = await fetch(`${process.env.API_URL}/clients/`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
