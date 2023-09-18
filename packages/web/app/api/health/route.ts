import { NextResponse } from "next/server";

type Data = {
  status: string;
};

export async function GET(_req: Request): Promise<NextResponse<Data>> {
  return NextResponse.json({ status: "OK" }, { status: 200 });
}
