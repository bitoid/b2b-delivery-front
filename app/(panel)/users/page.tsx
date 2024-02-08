// import { getCurrentUser } from "@/lib/session";
import React from "react";

export default async function page() {
  //   const user = await getCurrentUser();
  //   const couriers = await getCouriers(user?.token);
  //   const clients = await getClients(user?.token);
  return <div>page</div>;
}

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
    console.log(err);
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
    console.log(err);
  }
}