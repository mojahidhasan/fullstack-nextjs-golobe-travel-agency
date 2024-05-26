"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { c, getAll } from "@/lib/actions";
import { useState } from "react";
export default function DevPage() {
  const [data, setData] = useState(null);
  async function get() {
    const data = await getAll();
    setData(data);
  }
  return (
    <div className="w-[90%] mx-auto">
      <form action={c}>
        <Input name={"name"} />
        <Input name={"airport"} />
        <Button type="submit">Submit</Button>
      </form>
      <Button onClick={get}>Get all</Button>
      <div>{data && data.map((d) => <div key={d._id}>{d.name}</div>)}</div>
    </div>
  );
}
