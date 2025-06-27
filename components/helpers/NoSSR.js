import dynamic from "next/dynamic";
import React from "react";

const NoSsr = (props) => <React.Fragment>{props.children}</React.Fragment>;

// eslint-disable-next-line no-undef
function NoSSR({ children, fallback }) {
  const DynamicNoSSR = dynamic(() => Promise.resolve(NoSsr), {
    ssr: false,
    loading: () => fallback,
  });

  return <DynamicNoSSR>{children}</DynamicNoSSR>;
}

export default NoSSR;
