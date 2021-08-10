export default {
    concurrency: 10,
    nodeResolve: true,
    // in a monorepo you need to set set the root dir to resolve modules
    rootDir: '../../',
    testRunnerHtml: testFramework =>
      `<html>
        <body>
          <script>window.process = { env: { NODE_ENV: "development" } }</script>
          <script type="module" src="${testFramework}"></script>
        </body>
      </html>`,
  };