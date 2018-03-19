// Layout mit wiederverwendbaren Komponenten, die auf mehreren Seiten verwendet werden
import React from "react";
import Header from "./header";
import { Container } from "semantic-ui-react";
import Head from "next/head"; // Alles in Head Tag wird in index.html geladen!

// Props.Children ist JSX zw. <Layout> Tags in index.js
export default props => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};
