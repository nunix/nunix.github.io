import React from 'react';
import Layout from '@theme-original/Layout';
import BufferLoad from '@site/src/components/BufferLoad';
import type {Props} from '@theme/Layout';

export default function LayoutWrapper(props: Props): JSX.Element {
  return (
    <>
      <BufferLoad />
      <Layout {...props} />
    </>
  );
}