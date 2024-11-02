import { StreamClient, UserRequest } from "@stream-io/node-sdk";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.API_GETSTREAM_PUBLISHABLE_KEY;
const secret = process.env.API_GETSTREAM_SECRET_KEY;

if (!apiKey || !secret) {
  throw new Error("Missing GetStream API Keys");
}

const client = new StreamClient(apiKey, secret);

export async function POST(req: NextRequest) {
  const { userID, name, image, email } = await req.json();

  const newUser: UserRequest = {
    id: userID,
    role: "user",
    name,
    image,
    custom: {
      email,
    },
  };

  await client.upsertUsers([newUser]);

  const validity = 60 * 60;

  const token = client.generateUserToken({
    user_id: userID,
    validity_in_seconds: validity,
  });

  console.log(
    `User ${userID} created with token ${token} and validity ${validity}`
  );

  return NextResponse.json({
    token,
  });
}
