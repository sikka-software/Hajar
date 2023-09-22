import { Button } from "@sikka/hawa";
import Link from "next/link";
import React from "react";

const Landing = () => {
  return (
    <div>
      <div className="flex flex-col bg-red-500">This is hajar landing page</div>
      <div className="flex flex-row gap-2">
        <Link href="/docs">
          <Button>Docs</Button>
        </Link>{" "}
        <a href="https://github.com/sikka-software/hajar">
          <Button variant="outline">Github</Button>
        </a>{" "}
      </div>
    </div>
  );
};

export default Landing;
