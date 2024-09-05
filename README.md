<h3 id="drcode-wrapper">drcode-node</h3>
<p><strong>drcode-node</strong> is a Node.js package that facilitates error tracking and performance monitoring for your applications. Utilizing the DrCode package internally, drcode-node collects and processes application logs to provide detailed insights into errors and performance issues. With this package, you can easily integrate error tracking into your Node.js applications, helping you to maintain optimal performance and quickly address issues.</p>
<h4 id="installation">Installation</h4>
<p>To install the package, run:</p>
<p>bash</p>
<p>Copy code</p>
<pre><code class="language-const">npm i @drcode.ai/drcode-node </code></pre>

<h4 id="getting-started">Getting Started</h4>
<p><strong>Basic Usage</strong></p>
<p>javascript</p>
<p>Copy code</p>
<pre><code class="language-const">
const { initDrcode, setUpErrorHandler } = require('@drcode.ai/drcode-node');
const express = require('express');

const config = {
publicKey: 'yourPublicKey',
projectId: 'yourProjectId',
tracesSampleRate: 1.0, // optional
profilesSampleRate: 1.0 // optional
};

// Initialize drcode-wrapper
initDrcode(config);

// Express.js example for setting up error handler
const app = express();

app.use(setUpErrorHandler);

app.listen(3000, () => {
console.log('Server is running on port 3000');
});
</code></pre>

<h4 id="configuration">Configuration</h4>
<p><strong>Configuration Object</strong></p>
<ul>
<li><code>publicKey</code> (string): The public key for DrCode.</li>
<li><code>projectId</code> (string): The DrCode project ID.</li>
<li><code>tracesSampleRate</code> (number, optional): The sample rate for tracing (default: 1.0).</li>
<li><code>profilesSampleRate</code> (number, optional): The sample rate for profiling (default: 1.0).</li>
</ul>
<h4 id="api-reference">API Reference</h4>
<p><strong>Methods</strong></p>
<ul>
<li><p><strong>initDrcode(config: DrCodeConfig): void</strong></p>
<p>Initializes DrCode with the provided configuration.</p>
<ul>
<li><strong>config</strong> (DrCodeConfig): The configuration object.</li>
</ul>
</li>
<li><p><strong>setUpErrorHandler(err: Error, req: any, res: any, next: any): void</strong></p>
<p>Middleware for capturing exceptions in an Express.js application.</p>
</li>
</ul>
<p><strong>TypeScript Support</strong></p>
<p>The package includes TypeScript definitions for better developer experience.</p>
<p><strong>index.d.ts</strong></p>
<p>typescript</p>
<p>Copy code</p>
<pre><code class="language-const"> interface DrCodeConfig {

publicKey: string;
projectId: string;
tracesSampleRate?: number;
profilesSampleRate?: number;
}

export function initDrcode(config: DrCodeConfig): void;

export function setUpErrorHandler(
err: Error,
req: any,
res: any,
next: any
): void;

</code></pre>

<h4 id="license">License</h4>
<p>This project is licensed under the MIT License.</p>
<h4 id="version">Version</h4>
<p>1.0.7</p>
