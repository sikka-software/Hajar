import React from "react";
import Image from "next/image";
import { Button, Logos } from "@sikka/hawa";
import { useTheme } from "nextra-theme-docs";

export const CustomFooter = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-row  justify-between p-4 px-10">
      <a href="https://sikka.io">
        <Image
          alt="Sikka Logo"
          height={25}
          width={25}
          src={`https://sikka-images.s3.ap-southeast-1.amazonaws.com/sikka/brand/${
            resolvedTheme === "dark" ? "white" : "black"
          }-symbol.svg`}
        />
      </a>
      <div className="flex flex-row gap-2">
        <a href="https://twitter.com/sikka_sa">
          <Button variant="outline" size="smallIcon">
            <Logos.twitter className="h-4 w-4" />
          </Button>
        </a>
        <a href="https://github.com/sikka-software">
          <Button variant="outline" size="smallIcon">
            <Logos.gitHub className="h-4 w-4" />
          </Button>
        </a>
        <a href="mailto:sikka.apps@gmail.com">
          <Button variant="outline" size="smallIcon">
            <Logos.mail className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
};
