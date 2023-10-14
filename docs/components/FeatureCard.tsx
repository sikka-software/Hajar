import Link from "next/link";
import React from "react";

const FeatureCard = (props) => {
  return (
    <Link href={props.link}>
      <div className="flex h-24 flex-row items-center gap-4 border p-4 bg-background rounded hover:drop-shadow-lg transition-all">
        {props.icon}
        <div className="flex flex-col">
          <div className="flex flex-row font-bold">{props.title}</div>
          <div className="text-start text-xs flex flex-row ">
            {props.subtitle}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
