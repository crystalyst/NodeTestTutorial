// Docs: https://jestjs.io/docs/configuration
// Docs: https://gist.github.com/muditlambda/47f059433584f03dc5ccbff930b69752

module.exports = {
  // 해당 패턴에 일치하는 경로가 존재할 경우 테스트를 하지 않고 넘어갑니다.
  "testPathIgnorePatterns": [
    "/node_modules\/(?!my-package)(.*)",
    "/test/fixtures/",
    "/test/jest-grammars/"
  ],
  // 테스트 실행 시 각 TestCase에 대한 출력을 해줍니다.
  // jest --verbose와 동일한 역할을 함
  verbose: true,
}